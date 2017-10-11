import ApiSearchResponse from './ApiSearchResponse';
import HttpClient from './HttpClient';
import { RequestCallback } from './request';
export interface Field {
    [key: string]: string;
    value: string;
}
export interface Form {
    fields: any;
    action: string;
    name: string;
    rel: string;
    form_method: string;
    enctype: string;
}
export declare class SearchForm {
    httpClient: HttpClient;
    form: Form;
    data: any;
    constructor(form: Form, httpClient: HttpClient);
    set(field: string, value: any): SearchForm;
    /**
     * Sets a ref to query on for this SearchForm. This is a mandatory
     * method to call before calling submit(), and api.form('everything').submit()
     * will not work.
     */
    ref(ref: string): SearchForm;
    /**
     * Sets a predicate-based query for this SearchForm. This is where you
     * paste what you compose in your prismic.io API browser.
     */
    query(query: string | string[]): SearchForm;
    /**
     * Sets a page size to query for this SearchForm. This is an optional method.
     *
     * @param {number} size - The page size
     * @returns {SearchForm} - The SearchForm itself
     */
    pageSize(size: number): SearchForm;
    /**
     * Restrict the results document to the specified fields
     */
    fetch(fields: string | string[]): SearchForm;
    /**
     * Include the requested fields in the DocumentLink instances in the result
     */
    fetchLinks(fields: string | string[]): SearchForm;
    /**
     * Sets the language to query for this SearchForm. This is an optional method.
     */
    lang(langCode: string): SearchForm;
    /**
     * Sets the page number to query for this SearchForm. This is an optional method.
     */
    page(p: number): SearchForm;
    /**
     * Remove all the documents except for those after the specified document in the list. This is an optional method.
     */
    after(documentId: string): SearchForm;
    /**
     * Sets the orderings to query for this SearchForm. This is an optional method.
     */
    orderings(orderings?: string[]): SearchForm;
    /**
     * Build the URL to query
     */
    url(): string;
    /**
     * Submits the query, and calls the callback function.
     */
    submit(cb: RequestCallback<ApiSearchResponse>): Promise<ApiSearchResponse>;
}
