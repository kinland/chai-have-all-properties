type ChaiStatic = Chai.ChaiStatic;
type ChaiUtils = Chai.ChaiUtils;
type ChaiPlugin = Chai.ChaiPlugin;
type ChaiAssertion = Chai.AssertionStatic;

type PropertyNameType = string | number | symbol;
type PropertiesListType<T> = PropertyNameType[] | Record<PropertyNameType, T>;

export type { ChaiStatic, ChaiUtils, ChaiPlugin, ChaiAssertion, PropertyNameType, PropertiesListType };