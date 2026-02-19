// Liste d'erreurs personnalisées renvoyant le code http correspondant

// ValidationError : Le format des données n'est pas valide
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

// AuthentificationError : L'utilisateur n'est pas connecté
export class AuthentificationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthentificationError";
    this.status = 401;
  }
}

// ForbiddenError : L'utilisateur n'a pas les droits pour manipuler 
export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

// NotFoundError : La ressource n'existe pas dans la base de donnée
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

// ConflictError : Une donnée existe déjà (email déjà utilisé, nom indisponible)
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}
