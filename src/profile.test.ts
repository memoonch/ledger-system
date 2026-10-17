import { describe, expect, it } from 'vitest';
import { defaultProfile, uniqueOptions, validateProfile } from './profile';
import { validateStore } from './domain';
describe('shop profile and entry suggestions', () => {
  it('deduplicates saved and historical options without changing their text', () => {
    expect(uniqueOptions([' Cement ', 'cement', '', 'Steel', 'Steel'])).toEqual(['Cement','Steel']);
  });
  it('requires a shop name and validates optional fields and suggestion lengths', () => {
    expect(() => validateProfile({...defaultProfile,name:' '})).toThrow();
    expect(() => validateProfile({...defaultProfile,brands:['x'.repeat(81)]})).toThrow();
    expect(validateProfile(defaultProfile)).toEqual(defaultProfile);
  });
  it('accepts legacy backups and rejects malformed profile data', () => {
    expect(validateStore({parties:[],transactions:[]})).toEqual({parties:[],transactions:[]});
    expect(() => validateStore({parties:[],transactions:[],profile:{name:'Missing fields'}})).toThrow();
  });
});
