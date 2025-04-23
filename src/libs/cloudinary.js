import {v2} from 'cloudinary'

v2.config({
    cloud_name: "blasspod",
    api_key: "148413247764628",
    api_secret: "pzpXnsR1NKbw3QGh_jlCPl7KzjM"
})

export const uploadImage = async filePath => {
    return await v2.uploader.upload(filePath, {
        folder: 'blaspod'
    })
}

export const deleteImage = async id => {
    return await v2.uploader.destroy(id)
}