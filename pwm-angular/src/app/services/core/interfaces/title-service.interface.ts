/**
 * Interface defining the contract for title services
 */
export interface ITitleService {
  /**
   * Initialize the title service to update page title on route changes
   */
  initTitleService(): void;

  /**
   * Set the document title with the base title and page name
   * @param pageTitle The page title to append
   */
  setTitle(pageTitle: string): void;
}
