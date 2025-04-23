import { Configuration, OpenAIApi } from "openai"

export const createDescription = async (req, res) => {
    try {
        const { description, type } = req.body
        const configuration = new Configuration({
            organization: "org-s20w0nZ3MxE2TSG8LAAzz4TO",
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration)
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 1,
            messages: [
                {"role": "system", "content": `Ponte en la piel de un experto en copywriting especializado en ecommerce, quiero que redactes una descripción para la pagina de producto de máximo 500 caracteres con un tono ${type}`},
                {"role": "user", "content": `El producto es el siguiente: ${description}`}
            ]
        })
        return res.json(response.data.choices[0].message.content)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}