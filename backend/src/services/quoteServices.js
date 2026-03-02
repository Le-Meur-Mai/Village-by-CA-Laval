import QuoteRepository from "../repositories/QuoteRepository.js";
import UserRepository from "../repositories/UserRepository.js";
// Importation de la classe Quote et User repo
import Quote from "../classes/Quote.js";
import prisma from "../prismaClient.js";
// importation de l'instance du prisma client
import * as Errors from "../errors/errorsClasses.js";
// importation de toutes nos classes d'erreurs personnalisées

export default class QuoteServices {
  constructor() {
    this.quoteRepo = new QuoteRepository(prisma);
    this.userRepo = new UserRepository(prisma);
  }

  // POST Creation d'une nouvelle citation
  async createQuote(data) {
    try {
      const user = await this.userRepo.getUserById(data.userId);
      if (!user) {
        throw new Errors.NotFoundError("The user doesn't exist.");
      }
      new Quote(data);
      return await this.quoteRepo.createQuote(data);
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne la quote grâce à son ID
  async getQuoteById(id) {
    try {
      const quote = await this.quoteRepo.getQuoteById(id);
      if (!quote) {
        throw new Errors.NotFoundError("The quote doesn't exist.");
      }
      return quote;
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne toutes les citations d'un user basé sur son id
  async getQuotesByUser(userId) {
    try {
      const user = await this.userRepo.getUserById(id);
      if (!user) {
        throw new Errors.NotFoundError("The user is not found.");
      }
      return await this.quoteRepo.getQuotesByUser(userId);
    } catch (error) {
      throw error;
    }
  }
  
  // GET Retourne toutes les citations
  async getAllQuotes() {
    try {
      return await this.quoteRepo.getAllQuotes();
    } catch (error) {
      throw error;
    }
  }

  // PATCH Modification d'une citation existante
  async updateQuote(id, data, currentUser) {
    try {
      const existingQuote = await this.quoteRepo.getQuoteById(id);
      if (!existingQuote) {
        throw new Errors.NotFoundError("This quote doesn't exist");
      }

      // Changement de propriétaire
      if (data.userId && currentUser.isAdmin) {
        const user = await this.userRepo.getUserById(data.userId);
        if (!user) {
          throw new Errors.NotFoundError("The user is not found.");
        }
      } else if (data.userId && !currentUser.isAdmin) {
        throw new Errors.ForbiddenError(
          'You have to be an admin to change the owner of the quote.');
      }
      const newQuote = {...existingQuote, ...data};
      // On fusionne les anciennes données avec les nouveaux champs.
      new Quote(newQuote);
      return await this.quoteRepo.updateQuote(id, data);
    } catch (error) {
      throw error;
    }
  }

  // DELETE Suppression d'une citation
  async deleteQuote(id, currentUser) {
    try {
      const existingQuote = await this.quoteRepo.getQuoteById(id);
      if (!existingQuote) {
        throw new Errors.NotFoundError("The quote doesn't exist.");
      }
      if (!currentUser.isAdmin && currentUser.id !== existingQuote.user.id) {
        throw new Errors.ForbiddenError(
          'You have to be an admin or the owner to delete this quote.');
      }
      return await this.quoteRepo.deleteQuote(id);
    } catch (error) {
      throw error;
    }
  }
}
