/** 
 * Copyright (c) Hidekazu Kubota 
 * This source code is licensed under the Mozilla Public License Version 2.0 found in the LICENSE file in the root directory of this source tree.
 */

/* Tested with tsc 3.8.3 */

export {}

/**
 * Many notations for object type that has a construct signature
 * 
 * https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
 * https://microsoft.github.io/TypeScript-New-Handbook/everything/#abstract-construct-signatures
 * (https://microsoft.github.io/TypeScript-New-Handbook/everything/#call-signatures)
 */

 /**
  * constructor function and its corresponded construct signature
  */
class MyClassWithCtor {
    constructor() {}; // constructor function
    print: () => void = () => console.log('OK');
}

// 'new(...args: any[]): T' is a construct signature,
// in other words, it is a constructable object type.
function create<T>(ctor: { new(...args: any[]): T }) {
    return new ctor(); 
}
var func1a = create<MyClassWithCtor>(MyClassWithCtor);
func1a.print(); // OK


// constructor function may be omitted.
class MyClass {
    print: () => void = () => console.log('OK');
}
var func1b = create<MyClassWithCtor>(MyClassWithCtor);
func1b.print(); // OK


// Type parameter T can be omitted by using type argument inference.
// See https://www.typescriptlang.org/docs/handbook/generics.html#hello-world-of-generics
var func1c = create(MyClass); 
func1c.print(); // Ok 


// In this case, { new(): T } is also OK because constructor function has no parameters.
function create_<T>(ctor: { new(): T }) {
    return new ctor();
}
var func1d = create_(MyClass); 
func1d.print(); // Ok 


/**
 * Use constructor type literal.
 * A constructor type literal 'new(...args: any[]) => T'
 * is shorthand for an object type containing a single construct signature '{ new(...args: any[]): T }'.
 * https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#389-constructor-type-literals
 */
function create2<T>(ctor: new(...args: any[]) => T ) {
    return new ctor();
}
var func2 = create2(MyClass);
func2.print(); // Ok 


/**
 * Use utility interface, if you like.
 * Angular has 'Type' interface that Represents a type that a Component or other object is instances of.
 * See https://angular.io/api/core/Type
 * See also https://stackoverflow.com/a/52183279
 */
interface Type<T> extends Function { 
    new (...args: any[]): T;
}
const create3 = (ctor: Type<MyClass>): MyClass => {
    return new ctor();
}
var func3 = create3(MyClass);
func3.print();


// Would you like another name?
interface Constructable<T> extends Function { new (...args: any[]): T; }
const create3_ = (ctor: Constructable<MyClass>): MyClass => {
    return new ctor();
}
var func3b = create3_(MyClass);
func3b.print();


