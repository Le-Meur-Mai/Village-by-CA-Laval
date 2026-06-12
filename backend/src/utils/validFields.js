import * as Errors from "../errors/errorsClasses.js";

// Fonction utilisée dans les services pour vérifier les clés autorisées

export default function validFields (data, allowedFields) {
  // Vérifier si TOUTES les clés sont valides
  const invalidFields = Object.keys(data).filter(
    key => !allowedFields.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new Errors.ValidationError("Champs incorrects");
  }
}
