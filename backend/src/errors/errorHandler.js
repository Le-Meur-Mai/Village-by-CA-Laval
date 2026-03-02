export default function errorHandler(err, req, res, next) {
  // Envoie l'erreur complète dans la console
  console.error(err);

  if(err.status) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message
    })
  }

  return res.status(500).json({
    error: 'Server Error',
    message: 'Something wrong happened'
  })
}