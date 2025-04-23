import { Configuration, OpenAIApi } from "openai"

export const createDescriptionSeo = async (req, res) => {
    try {
        const { description } = req.body
        const configuration = new Configuration({
            organization: "org-s20w0nZ3MxE2TSG8LAAzz4TO",
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `ARespóndeme como un experto en copywriting y seo especializado en E-commerce con mas de 15 años de experiencia. Quiero que redactes una meta descripción para una categoria de un E-commerce. La categoria es: ${description}`,
            max_tokens: 1000,
            temperature: 0
        })
        console.log(response.data.choices)
        return res.json(response.data.choices)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}