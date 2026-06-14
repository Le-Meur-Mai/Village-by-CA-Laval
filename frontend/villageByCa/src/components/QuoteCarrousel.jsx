import { useState, useEffect } from "react";
import QuoteCard from "./QuoteCard.jsx";
import "../styles/QuoteCarrousel.css";

/**
 * Hook personnalisé : useMediaQuery
 * Ce hook permet de savoir si une media query CSS est vraie ou fausse.
 * Exemple : "(max-width: 768px)" → true si l'écran fait moins de 768px.
 * Il renvoie :
 * - true → si la media query correspond
 * - false → si elle ne correspond pas
 * - null → au tout premier rendu, avant d'avoir la vraie valeur (execution des useEffect après le premier rendu)
 */
function useMediaQuery(query) {
  // Valeur initiale : null = on ne sait pas encore si on est mobile ou non
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    // Sécurité SSR : window n'existe pas côté serveur
    if (typeof window === "undefined") return;

    /**
     * window.matchMedia(query)
     * API du navigateur qui permet de tester une media query CSS.
     * Elle renvoie un objet MediaQueryList contenant :
     * - .matches → true si la media query est vraie
     * - .media → la query elle-même
     */
    const media = window.matchMedia(query);

    // On met à jour immédiatement selon la taille actuelle de l'écran
    setMatches(media.matches);

    /**
     * media.addEventListener("change", listener)
     * On écoute les changements de la media query.
     * Le navigateur déclenche "change" quand :
     * - la fenêtre est redimensionnée
     * - le téléphone pivote (portrait ↔ paysage)
     * - le viewport change
     * À chaque changement, on met à jour le state React.
     */
    const listener = () => setMatches(media.matches);

    media.addEventListener("change", listener);

    // Nettoyage : on retire l'écouteur quand le composant est démonté
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function QuoteCarrousel({ quotes }) {

  /**
   * Détection mobile
   * On utilise notre hook pour savoir si on est en mobile.
   * isMobile = true  → écran < 768px
   * isMobile = false → écran >= 768px
   */
  const isMobile = useMediaQuery("(max-width: 900px)");

  /**
   * groupSize
   * Nombre de quotes par slide :
   * - 1 en mobile
   * - 3 en desktop
   */
  const groupSize = isMobile ? 1 : 3;

  /**
   * groups
   * On découpe les quotes en groupes de 1 ou 3.
   * Exemple si 7 quotes et groupSize = 3 :
   * [
   *   [quote1, quote2, quote3],
   *   [quote4, quote5, quote6],
   *   [quote7]
   * ]
   */
  const groups = chunkArray(quotes || [], groupSize);

  /**
   * index
   * index = numéro du slide affiché.
   * 0 = premier slide
   */
  const [index, setIndex] = useState(0);

  /**
   * useEffect(() => setIndex(0), [groupSize])
   * Quand on passe de desktop → mobile (ou inversement),
   * groupSize change (3 → 1 ou 1 → 3).
   * On remet donc le carrousel au début pour éviter :
   * - un index invalide
   * - un slide vide
   */
  useEffect(() => {
    setIndex(0);
  }, [groupSize]);

  // Si aucune quote, on n'affiche rien
  if (!quotes || quotes.length === 0) return null;

  /**
   * next()
   * Passe au slide suivant.
   * (prev + 1) % groups.length
   * Le modulo (%) permet de boucler automatiquement.
   * Exemple :
   * - prev = 2, groups.length = 3
   * - (2 + 1) % 3 = 0 → on revient au début
   */
  const next = () =>
    setIndex((prev) => (prev + 1) % groups.length);

  /**
   * prev()
   * Passe au slide précédent.
   * (prev - 1 + groups.length) % groups.length
   * On ajoute groups.length pour éviter les valeurs négatives.
   * Exemple :
   * - prev = 0, groups.length = 3
   * - (0 - 1 + 3) % 3 = 2 → on va au dernier slide
   */
  const prev = () =>
    setIndex((prev) => (prev - 1 + groups.length) % groups.length);

  return (
    <div className="quote-carrousel">
      <button className="carrousel-btn" onClick={prev}>‹</button>

      <div className="quote-group">
        {/**
         * groups[index]
         * Le groupe de quotes correspondant au slide actuel.
         * .map() → on génère une <QuoteCard /> pour chaque quote du groupe.
         * En mobile : 1 quote
         * En desktop : 3 quotes
         */}
        {groups[index]?.map((quote) => (
          <QuoteCard
              key={quote.id}           // Clé unique requise par React pour optimiser le rendu des listes
              id={quote.id}
              logo={quote.startUp?.logo}   // Opérateur ?. : évite un crash si startUp est null/undefined
              name={quote.startUp?.name}   // Idem
              firstName={quote.firstName}
              lastName={quote.lastName}
              description={quote.description}
              canBeModified={false}         // Impossible de modifier la citation
          />
        ))}
      </div>

      <button className="carrousel-btn" onClick={next}>›</button>
    </div>
  );
}

/**
 * chunkArray
 * Fonction utilitaire pour découper un tableau en sous-tableaux.
 *
 * Exemple :
 * chunkArray([1,2,3,4,5], 2)
 * → [[1,2], [3,4], [5]]
 *
 * Ici, elle sert à créer des "slides" de 1 ou 3 quotes.
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
