import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  //transform(value: any, searchText: any): any {

  // if (!value) { return []; }
  // if (!searchText) { return value }

  //const value = list.replace(
  // searchText, `<span style='background-color:yellow'>${searchText}</span>`);
  // console.log('value', value);

  //return this._sanitizer.bypassSecurityTrustHtml(value);

  // const re = new RegExp(searchText, 'gi');
  //return value.replace(re, `<mark class='yellow' style='background-color:yellow'>${searchText}</mark>`);

  transform(value: string, searchTerm: string): string {
    if (!value || !searchTerm) return value;
    const startIndex: number = value.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (startIndex === -1) return value;
    const endIndex: number = startIndex + searchTerm.length;
    const textBeforeHighlight: string = value.substring(0, startIndex);
    const highlightedText: string = value.substring(startIndex, endIndex);
    console.log(highlightedText)
    const textAfterHighlight: string = value.substring(endIndex);
    return `${textBeforeHighlight}<mark style='background-color:yellow'>${highlightedText}</mark>${textAfterHighlight}`;
  }
}

