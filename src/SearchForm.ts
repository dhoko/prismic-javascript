import { FormData } from './form';
import { RequestCallback } from './request';
import ApiSearchResponse from './ApiSearchResponse';
import HttpClient from './HttpClient';

export default class SearchForm {
  httpClient: HttpClient;
  form: FormData;
  data: any;

  constructor(form: FormData, httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.form = form;

    this.data = {};
    for (const field in form.fields) {
      if (form.fields[field]['default']) {
        this.data[field] = [form.fields[field]['default']];
      }
    }
  }

  set(field: string, value: any): SearchForm {
    const fieldDesc = this.form.fields[field];
    if (!fieldDesc) throw new Error('Unknown field ' + field);
    const checkedValue = value === '' || value === undefined ? null : value;
    let values = this.data[field] || [];
    if (fieldDesc.multiple) {
      values = checkedValue ? values.concat([checkedValue]) : values;
    } else {
      values = checkedValue ? [checkedValue] : values;
    }
    this.data[field] = values;
    return this;
  }

  /**
   * Sets a ref to query on for this SearchForm. This is a mandatory
   * method to call before calling submit(), and api.form('everything').submit()
   * will not work.
   */
  ref(ref: string): SearchForm {
    return this.set('ref', ref);
  }

  /**
   * Sets a predicate-based query for this SearchForm. This is where you
   * paste what you compose in your prismic.io API browser.
   */
  query(query: string | string[]): SearchForm {
    if (typeof query === 'string') {
      return this.query([query]);
    } else if (Array.isArray(query)) {
      return this.set('q', `[${query.join('')}]`);
    } else {
      throw new Error(`Invalid query : ${query}`);
    }
  }

  /**
   * Sets a page size to query for this SearchForm. This is an optional method.
   *
   * @param {number} size - The page size
   * @returns {SearchForm} - The SearchForm itself
   */
  pageSize(size: number): SearchForm {
    return this.set('pageSize', size);
  }

  /**
   * Sets the graphquery to query for this SearchForm. This is an optional method.
   */
  graphQuery(query: string): SearchForm {
    return this.set('graphQuery', query);
  }

  /**
   * Sets the language to query for this SearchForm. This is an optional method.
   */
  lang(langCode: string): SearchForm {
    return this.set('lang', langCode);
  }

  /**
   * Sets the page number to query for this SearchForm. This is an optional method.
   */
  page(p: number): SearchForm {
    return this.set('page', p);
  }

  /**
   * Remove all the documents except for those after the specified document in the list. This is an optional method.
   */
  after(documentId: string): SearchForm {
    return this.set('after', documentId);
  }

  /**
   * Sets the orderings to query for this SearchForm. This is an optional method.
   */
  orderings(orderings?: string[]): SearchForm {
    if (!orderings) {
      return this;
    } else {
      return this.set('orderings', `[${orderings.join(',')}]`);
    }
  }

  /**
   * Build the URL to query
   */
  url(): string {
    let url = this.form.action;
    if (this.data) {
      let sep = (url.indexOf('?') > -1 ? '&' : '?');
      for (const key in this.data) {
        if  (Object.prototype.hasOwnProperty.call(this.data, key)) {
          const values = this.data[key];
          if (values) {
            for (let i = 0; i < values.length; i++) {
              url += sep + key + '=' + encodeURIComponent(values[i]);
              sep = '&';
            }
          }
        }
      }
    }
    return url;
  }

  /**
   * Submits the query, and calls the callback function.
   */
  submit(cb: RequestCallback<ApiSearchResponse>): Promise<ApiSearchResponse> {
    return this.httpClient.cachedRequest<ApiSearchResponse>(this.url()).then((response) => {
      cb && cb(null, response);
      return response;
    }).catch((error) => {
      cb && cb(error);
      throw error;
    });
  }
}
