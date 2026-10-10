export const uploadToCloudinary = async (file, folder = 'uploads') => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    if (data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        bytes: data.bytes
      }
    } else {
      throw new Error(data.error?.message || 'Upload failed')
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const uploadMultipleToCloudinary = async (files, folder = 'anita-doval') => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder))
  const results = await Promise.all(uploadPromises)
  return results
}