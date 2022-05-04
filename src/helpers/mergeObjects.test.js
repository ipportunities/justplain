import React from 'react'
import { mergeDeep } from './mergeObjects'

describe('Exam text parser', () => {
  it('should return an empty object when target is not an object', () => {
    const not_object_a = 1
    const object_b = { b: 2 }
    const merged = mergeDeep(not_object_a, object_b)
    expect(merged).toEqual({})
  })
  it('should return target object when source is not an object', () => {
    const object_a = { a: 1 }
    const not_object_b = 2
    const merged = mergeDeep(object_a, not_object_b)
    expect(merged).toEqual({ a: 1 })
  })
  it('should merge an object with one layer', () => {
    const object_a = { a: 1 }
    const object_b = { b: 2 }
    const merged = mergeDeep(object_a, object_b)
    expect(merged).toEqual({ a: 1, b: 2 })
  })
  it('should merge an object with two layers', () => {
    const object_a = { a: 1, c: { d: 1 } }
    const object_b = { b: 2, c: { e: 2 } }
    const merged = mergeDeep(object_a, object_b)
    expect(merged).toEqual({ a: 1, b: 2, c: { d: 1, e: 2 } })
  })
  it('should merge an object with three layers', () => {
    const object_a = { a: 1, c: { d: 1, f: { g: 1 } } }
    const object_b = { b: 2, c: { e: 2, f: { h: 2 } } }
    const merged = mergeDeep(object_a, object_b)
    expect(merged).toEqual({ a: 1, b: 2, c: { d: 1, e: 2, f: { g: 1, h: 2 } } })
  })
  it('should merge an object with four layers', () => {
    const object_a = { a: 1, c: { d: 1, f: { g: 1, i: { j: 1 } } } }
    const object_b = { b: 2, c: { e: 2, f: { h: 2, i: { k: 2 } } } }
    const merged = mergeDeep(object_a, object_b)
    expect(merged).toEqual({ a: 1, b: 2, c: { d: 1, e: 2, f: { g: 1, h: 2, i: { j: 1, k: 2 } } } })
  })
  it('should merge an object with five layers', () => {
    const object_a = { a: 1, c: { d: 1, f: { g: 1, i: { j: 1, l: { m: 1 } } } } }
    const object_b = { b: 2, c: { e: 2, f: { h: 2, i: { k: 2, l: { n: 2 } } } } }
    const merged = mergeDeep(object_a, object_b)
    expect(merged).toEqual({ a: 1, b: 2, c: { d: 1, e: 2, f: { g: 1, h: 2, i: { j: 1, k: 2, l: { m: 1, n: 2 } } } } })
  })
  it('should merge an object with five layers with new key in source', () => {
    const object_a = { a: 1, c: { d: 1, f: { g: 1, i: { j: 1, l: { m: 1 } } } } }
    const object_b = { b: 2, c: { e: 2, o: { h: 2, i: { k: 2, l: { n: 2 } } } } }
    const merged = mergeDeep(object_a, object_b)
    expect(merged).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 1,
        e: 2,
        f: {
          g: 1,
          i: {
            j: 1,
            l: {
              m: 1
            }
          }
        },
        o: {
          h: 2,
          i: {
            k: 2,
            l: {
              n: 2
            }
          }
        }
      }
    })
  })
})
