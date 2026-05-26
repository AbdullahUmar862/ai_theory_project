import type { Config } from '@netlify/functions'

export default async (req: Request) => {
  return Response.json(
    {
      success: false,
      error:
        'The fruit disease detection model is not available in this deployment. ' +
        'The trained model files (fruit_disease_model.h5 and fruit_class_labels.json) must be ' +
        'present in the model/ directory and the server must be running locally with TensorFlow installed.',
    },
    { status: 503 },
  )
}

export const config: Config = {
  path: '/api/analyze_fruit',
  method: 'POST',
}
