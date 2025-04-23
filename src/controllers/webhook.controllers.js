import { Configuration, OpenAIApi } from "openai"
import Product from '../models/Product.js'
import axios from "axios"
import MessengerMessage from "../models/MessengerChat.js"
import WhatsappMessage from '../models/WhatsappChat.js'
import InstagramMessage from '../models/InstagramChat.js'
import { io } from '../index.js'
import Politics from '../models/Politics.js'
import StoreData from '../models/StoreData.js'

export const createWebhook = (req, res) => {
    if (req.query['hub.verify_token'] === `${process.env.NAME_STORE}_token`) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('No tienes permisos')
    }
}

export const getMessage = async (req, res) => {
    try {
        if (req.body?.entry && req.body.entry[0]?.changes && req.body.entry[0].changes[0]?.value?.messages && 
            req.body.entry[0].changes[0].value.messages[0]?.text && req.body.entry[0].changes[0].value.messages[0].text.body) {  
            let ultimateMessages
            const message = req.body.entry[0].changes[0].value.messages[0].text.body
            const number = req.body.entry[0].changes[0].value.messages[0].from
            const messages = await WhatsappMessage.find({phone: number}).select('-phone -_id').lean()
            const ultimateMessage = messages.reverse()
            if (ultimateMessage && ultimateMessage.length) {
                ultimateMessages = `${ultimateMessage[0].response}. ${message}`
            } else {
                ultimateMessages = message
            }
            if (ultimateMessage && ultimateMessage.length && ultimateMessage[0].agent) {
                const newMessage = new WhatsappMessage({phone: number, message: message, agent: true, view: false})
                await newMessage.save()
                io.emit('whatsapp', newMessage)
                return res.sendStatus(200)
            } else {
                const configuration = new Configuration({
                    organization: "org-s20w0nZ3MxE2TSG8LAAzz4TO",
                    apiKey: process.env.OPENAI_API_KEY,
                })
                const openai = new OpenAIApi(configuration)
                const responseCategorie = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                    messages: [
                        {"role": "system", "content": 'Con las siguientes categorias: saludo, productos, envíos, horarios, ubicación, seguridad, garantía, devoluciones, agradecimientos y despidos. Cuales encajan mejor con la siguiente pregunta'},
                        {"role": "user", "content": ultimateMessages}
                    ]
                })
                const categories = responseCategorie.data.choices[0].message.content.toLowerCase()
                if (categories.includes('saludo')) {
                    await axios.post('https://graph.facebook.com/v16.0/108940562202993/messages', {
                        "messaging_product": "whatsapp",
                        "to": number,
                        "type": "text",
                        "text": {"body": '¡Hola! En que te puedo ayudar?'}
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`
                        }
                    })
                    const newMessage = new WhatsappMessage({phone: number, message: message, response: '¡Hola! En que te puedo ayudar?', agent: false, view: false})
                    await newMessage.save()
                    return res.send(newMessage)
                }
                let information = ''
                if (categories.includes('productos')) {
                    const products = await Product.find().select('name stock price beforePrice variations.variation variations.stock category tags -_id').lean()
                    const productsString = JSON.stringify(products)
                    const regex = new RegExp('"', 'g')
                    const filter = productsString.replace(regex, '')
                    if (products.length) {
                        information = `${information}. ${filter}`
                    }
                }
                if (categories.includes('garantía') || categories.includes('devoluciones')) {
                    const politics = await Politics.findOne().select('devolutions -_id').lean()
                    if (politics.devolutions) {
                        information = `${information}. ${politics.devolutions}`
                    }
                }
                if (categories.includes('envíos')) {
                    const politics = await Politics.findOne().select('shipping -_id').lean()
                    if (politics.shipping) {
                        information = `${information}. ${politics.shipping}`
                    }
                }
                if (categories.includes('horarios') || categories.includes('ubicación')) {
                    const storeData = await StoreData.findOne().select('address departament region city schedule -_id').lean()
                    if (storeData) {
                        information = `${information}. ${JSON.stringify(storeData)}`
                    }
                }
                let structure
                let agent
                if (message.toLowerCase() === 'agente') {
                    agent = true
                    await axios.post('https://graph.facebook.com/v16.0/108940562202993/messages', {
                        "messaging_product": "whatsapp",
                        "to": number,
                        "type": "text",
                        "text": {"body": '¡Perfecto! En este momento te estamos transfiriendo con un operador, espera unos minutos'}
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`
                        }
                    })
                    const newMessage = new WhatsappMessage({phone: number, message: message, response: '¡Perfecto! En este momento te estamos transfiriendo con un operador, espera unos minutos', agent: agent, view: false})
                    await newMessage.save()
                    if (agent) {
                        io.emit('whatsapp', newMessage)
                    }
                    return res.sendStatus(200)
                } else if (categories.includes('agradecimientos') || categories.includes('despidos')) {
                    if (ultimateMessage.length) {
                        structure = [
                            {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                            {"role": "user", "content": ultimateMessage[0].message},
                            {"role": "assistant", "content": ultimateMessage[0].response},
                            {"role": "user", "content": message}
                        ]
                        agent = false
                    } else {
                        structure = [
                            {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                            {"role": "user", "content": message}
                        ]
                        agent = false
                    }
                } else if (information === '') {
                    agent = false
                    await axios.post('https://graph.facebook.com/v16.0/108940562202993/messages', {
                        "messaging_product": "whatsapp",
                        "to": number,
                        "type": "text",
                        "text": {"body": 'Lo siento, no tengo la información necesaria para responder tu pregunta, puedes ingresar "agente" en el chat para comunicarte con un operador'}
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`
                        }
                    })
                    const newMessage = new WhatsappMessage({phone: number, message: message, response: 'Lo siento, no tengo la información necesaria para responder tu pregunta, puedes ingresar "agente" en el chat para comunicarte con un operador', agent: agent, view: false})
                    await newMessage.save()
                    if (agent) {
                        io.emit('whatsapp', newMessage)
                    }
                    return res.sendStatus(200)
                } else if (ultimateMessage.length) {
                    structure = [
                        {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                        {"role": "user", "content": ultimateMessage[0].message},
                        {"role": "assistant", "content": ultimateMessage[0].response},
                        {"role": "user", "content": message}
                    ]
                    agent = false
                } else {
                    structure = [
                        {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                        {"role": "user", "content": message}
                    ]
                    agent = false
                }
                const responseChat = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                    messages: structure
                })
                const responseMessage = responseChat.data.choices[0].message.content
                await axios.post('https://graph.facebook.com/v16.0/108940562202993/messages', {
                    "messaging_product": "whatsapp",
                    "to": number,
                    "type": "text",
                    "text": {"body": responseMessage}
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`
                    }
                })
                const newMessage = new WhatsappMessage({phone: number, message: message, response: responseMessage, agent: agent, view: false})
                await newMessage.save()
                if (agent) {
                    io.emit('whatsapp', newMessage)
                }
                return res.sendStatus(200)
            }
        } else if (req.body?.entry && req.body.entry[0]?.messaging && req.body.entry[0].messaging[0]?.message?.text && req.body.entry[0].id === '106714702292810') {
            let ultimateMessages
            const message = req.body.entry[0].messaging[0].message.text
            const sender = req.body.entry[0].messaging[0].sender.id
            const messages = await MessengerMessage.find({messengerId: sender}).select('-messengerId -_id').lean()
            const ultimateMessage = messages.reverse()
            if (ultimateMessage && ultimateMessage.length) {
                ultimateMessages = `${ultimateMessage[0].response}. ${message}`
            } else {
                ultimateMessages = message
            }
            if (ultimateMessage && ultimateMessage.length && ultimateMessage[0].agent) {
                const newMessage = new MessengerMessage({messengerId: sender, message: message, agent: true, view: false})
                await newMessage.save()
                io.emit('messenger', newMessage)
                return res.sendStatus(200)
            } else {
                const configuration = new Configuration({
                    organization: "org-s20w0nZ3MxE2TSG8LAAzz4TO",
                    apiKey: process.env.OPENAI_API_KEY,
                })
                const openai = new OpenAIApi(configuration)
                const responseCategorie = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                    messages: [
                        {"role": "system", "content": 'Con las siguientes categorias: saludo, productos, envíos, horarios, ubicación, seguridad, garantía, devoluciones, agradecimientos y despidos. Cuales encajan mejor con la siguiente pregunta'},
                        {"role": "user", "content": ultimateMessages}
                    ]
                })
                const categories = responseCategorie.data.choices[0].message.content.toLowerCase()
                if (categories.includes('saludo')) {
                    await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                        "recipient": {
                            "id": sender
                        },
                        "messaging_type": "RESPONSE",
                        "message": {
                            "text": '¡Hola! En que te puedo ayudar?'
                        }
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    const newMessage = new MessengerMessage({messengerId: sender, message: message, response: '¡Hola! En que te puedo ayudar?', agent: agent, view: false})
                    await newMessage.save()
                    return res.send(newMessage)
                }
                let information = ''
                if (categories.includes('productos')) {
                    const products = await Product.find().select('name stock price beforePrice variations.variation variations.stock category tags -_id').lean()
                    const productsString = JSON.stringify(products)
                    const regex = new RegExp('"', 'g')
                    const filter = productsString.replace(regex, '')
                    if (products.length) {
                        information = `${information}. ${filter}`
                    }
                }
                if (categories.includes('garantía') || categories.includes('devoluciones')) {
                    const politics = await Politics.findOne().select('devolutions -_id').lean()
                    if (politics.devolutions) {
                        information = `${information}. ${politics.devolutions}`
                    }
                }
                if (categories.includes('envíos')) {
                    const politics = await Politics.findOne().select('shipping -_id').lean()
                    if (politics.shipping) {
                        information = `${information}. ${politics.shipping}`
                    }
                }
                if (categories.includes('horarios') || categories.includes('ubicación')) {
                    const storeData = await StoreData.findOne().select('address departament region city schedule -_id').lean()
                    if (storeData) {
                        information = `${information}. ${JSON.stringify(storeData)}`
                    }
                }
                let structure
                let agent
                if (message.toLowerCase() === 'agente') {
                    agent = true
                    await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                        "recipient": {
                            "id": sender
                        },
                        "messaging_type": "RESPONSE",
                        "message": {
                            "text": '¡Perfecto! En este momento te estamos transfiriendo con un operador, espera unos minutos'
                        }
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    const newMessage = new MessengerMessage({messengerId: sender, message: message, response: '¡Perfecto! En este momento te estamos transfiriendo con un operador, espera unos minutos', agent: agent, view: false})
                    await newMessage.save()
                    if (agent) {
                        io.emit('messenger', newMessage)
                    }
                    return res.sendStatus(200)
                } else if (categories.includes('agradecimientos') || categories.includes('despidos')) {
                    if (ultimateMessage.length) {
                        structure = [
                            {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                            {"role": "user", "content": ultimateMessage[0].message},
                            {"role": "assistant", "content": ultimateMessage[0].response},
                            {"role": "user", "content": message}
                        ]
                        agent = false
                    } else {
                        structure = [
                            {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                            {"role": "user", "content": message}
                        ]
                        agent = false
                    }
                } else if (information === '') {
                    agent = false
                    await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                        "recipient": {
                            "id": sender
                        },
                        "messaging_type": "RESPONSE",
                        "message": {
                            "text": 'Lo siento, no tengo la información necesaria para responder tu pregunta, puedes ingresar "agente" en el chat para comunicarte con un operador'
                        }
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    const newMessage = new MessengerMessage({messengerId: sender, message: message, response: 'Lo siento, no tengo la información necesaria para responder tu pregunta, puedes ingresar "agente" en el chat para comunicarte con un operador', agent: agent, view: false})
                    await newMessage.save()
                    if (agent) {
                        io.emit('messenger', newMessage)
                    }
                    return res.sendStatus(200)
                } else if (ultimateMessage.length) {
                    structure = [
                        {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                        {"role": "user", "content": ultimateMessage[0].message},
                        {"role": "assistant", "content": ultimateMessage[0].response},
                        {"role": "user", "content": message}
                    ]
                    agent = false
                } else {
                    structure = [
                        {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                        {"role": "user", "content": message}
                    ]
                    agent = false
                }
                const responseChat = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                    messages: structure
                })
                const responseMessage = responseChat.data.choices[0].message.content
                await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                    "recipient": {
                        "id": sender
                    },
                    "messaging_type": "RESPONSE",
                    "message": {
                        "text": responseMessage
                    }
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const newMessage = new MessengerMessage({messengerId: sender, message: message, response: responseMessage, agent: agent, view: false})
                await newMessage.save()
                if (agent) {
                    io.emit('messenger', newMessage)
                }
                return res.sendStatus(200)
            }
        } else if (req.body?.entry && req.body.entry[0]?.messaging && req.body.entry[0].messaging[0]?.message?.text && req.body.entry[0].id === '17841457418025747') {
            let ultimateMessages
            const message = req.body.entry[0].messaging[0].message.text
            const sender = req.body.entry[0].messaging[0].sender.id
            const messages = await InstagramMessage.find({messengerId: sender}).select('-instagramId -_id').lean()
            const ultimateMessage = messages.reverse()
            if (ultimateMessage && ultimateMessage.length) {
                ultimateMessages = `${ultimateMessage[0].response}. ${message}`
            } else {
                ultimateMessages = message
            }
            if (ultimateMessage && ultimateMessage.length && ultimateMessage[0].agent && sender !== '17841457418025747') {
                const newMessage = new InstagramMessage({instagramId: sender, message: message, agent: true, view: false})
                await newMessage.save()
                io.emit('instagram', newMessage)
                return res.sendStatus(200)
            } else {
                const configuration = new Configuration({
                    organization: "org-s20w0nZ3MxE2TSG8LAAzz4TO",
                    apiKey: process.env.OPENAI_API_KEY,
                })
                const openai = new OpenAIApi(configuration)
                const responseCategorie = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                    messages: [
                        {"role": "system", "content": 'Con las siguientes categorias: saludo, productos, envíos, horarios, ubicación, seguridad, garantía, devoluciones, agradecimientos y despidos. Cuales encajan mejor con la siguiente pregunta'},
                        {"role": "user", "content": ultimateMessages}
                    ]
                })
                const categories = responseCategorie.data.choices[0].message.content.toLowerCase()
                if (categories.includes('saludo')) {
                    await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                        "recipient": {
                            "id": sender
                        },
                        "messaging_type": "RESPONSE",
                        "message": {
                            "text": '¡Hola! En que te puedo ayudar?'
                        }
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    const newMessage = new InstagramMessage({instagramId: sender, message: message, response: '¡Hola! En que te puedo ayudar?', agent: false, view: false})
                    await newMessage.save()
                    return res.send(newMessage)
                }
                let information = ''
                if (categories.includes('productos')) {
                    const products = await Product.find().select('name stock price beforePrice variations.variation variations.stock category tags -_id').lean()
                    const productsString = JSON.stringify(products)
                    const regex = new RegExp('"', 'g')
                    const filter = productsString.replace(regex, '')
                    if (products.length) {
                        information = `${information}. ${filter}`
                    }
                }
                if (categories.includes('garantía') || categories.includes('devoluciones')) {
                    const politics = await Politics.findOne().select('devolutions -_id').lean()
                    if (politics.devolutions) {
                        information = `${information}. ${politics.devolutions}`
                    }
                }
                if (categories.includes('envíos')) {
                    const politics = await Politics.findOne().select('shipping -_id').lean()
                    if (politics.shipping) {
                        information = `${information}. ${politics.shipping}`
                    }
                }
                if (categories.includes('horarios') || categories.includes('ubicación')) {
                    const storeData = await StoreData.findOne().select('address departament region city schedule -_id').lean()
                    if (storeData) {
                        information = `${information}. ${JSON.stringify(storeData)}`
                    }
                }
                let structure
                let agent
                if (message.toLowerCase() === 'agente') {
                    if (sender !== '17841457418025747') {
                        agent = true
                        await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                            "recipient": {
                                "id": sender
                            },
                            "messaging_type": "RESPONSE",
                            "message": {
                                "text": '¡Perfecto! En este momento te estamos transfiriendo con un operador, espera unos minutos'
                            }
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        const newMessage = new InstagramMessage({instagramId: sender, message: message, response: '¡Perfecto! En este momento te estamos transfiriendo con un operador, espera unos minutos', agent: agent, view: false})
                        await newMessage.save()
                        if (agent) {
                            io.emit('instagram', newMessage)
                        }
                        return res.sendStatus(200)
                    }
                } else if (categories.includes('agradecimientos') || categories.includes('despidos')) {
                    if (ultimateMessage.length > 1) {
                        structure = [
                            {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                            {"role": "user", "content": ultimateMessage[0].message},
                            {"role": "assistant", "content": ultimateMessage[0].response},
                            {"role": "user", "content": message}
                        ]
                        agent = false
                    } else {
                        structure = [
                            {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                            {"role": "user", "content": message}
                        ]
                        agent = false
                    }
                } else if (information === '') {
                    agent = false
                    if (sender !== '17841457418025747') {
                        await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                            "recipient": {
                                "id": sender
                            },
                            "messaging_type": "RESPONSE",
                            "message": {
                                "text": 'Lo siento, no tengo la información necesaria para responder tu pregunta, puedes ingresar "agente" en el chat para comunicarte con un operador'
                            }
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        const newMessage = new InstagramMessage({instagramId: sender, message: message, response: 'Lo siento, no tengo la información necesaria para responder tu pregunta, puedes ingresar "agente" en el chat para comunicarte con un operador', agent: agent, view: false})
                        await newMessage.save()
                        if (agent) {
                            io.emit('instagram', newMessage)
                        }
                        return res.sendStatus(200)
                    }
                } else if (ultimateMessage.length) {
                    structure = [
                        {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                        {"role": "user", "content": ultimateMessage[0].message},
                        {"role": "assistant", "content": ultimateMessage[0].response},
                        {"role": "user", "content": message}
                    ]
                    agent = false
                } else {
                    structure = [
                        {"role": "system", "content": `Eres un asistente llamado Maaibot de la tienda Maaide, responde la pregunta con un maximo de 200 caracteres, la unica informacion que usaras para responder la pregunta es la siguiente: ${information}, para realizar una compra o hablar con un agente, puede llamar a un agente escribiendo "agente" en el chat`},
                        {"role": "user", "content": message}
                    ]
                    agent = false
                }
                const responseChat = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                    messages: structure
                })
                const responseMessage = responseChat.data.choices[0].message.content
                if (sender !== '17841457418025747') {
                    await axios.post(`https://graph.facebook.com/v16.0/106714702292810/messages?access_token=${process.env.MESSENGER_TOKEN}`, {
                        "recipient": {
                            "id": sender
                        },
                        "messaging_type": "RESPONSE",
                        "message": {
                            "text": responseMessage
                        }
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    const newMessage = new InstagramMessage({instagramId: sender, message: message, response: responseMessage, agent: agent, view: false})
                    await newMessage.save()
                    if (agent) {
                        io.emit('instagram', newMessage)
                    }
                    return res.sendStatus(200)
                }
            }
        } else {
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}