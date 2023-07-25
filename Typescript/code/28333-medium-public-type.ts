/**
 * 实现：
 */
type PublicType<T extends object> = {
    [K in keyof T as K extends `_${infer _}` ? never : K]: T[K]
}




/* Question：
Remove the key starting with `_` from given type `T`. */
type A = PublicType<{ d: string; _e: string }>; // expect: { d: string }




/**
 * Test Case：
 */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
    Expect<Equal<PublicType<{ a: number }>, { a: number }>>,
    Expect<Equal<PublicType<{ _b: string | bigint }>, {}>>,
    Expect<Equal<PublicType<{ readonly c?: number }>, { readonly c?: number }>>,
    Expect<Equal<PublicType<{ d: string; _e: string }>, { d: string }>>,
    Expect<Equal<PublicType<{ _f: () => bigint[] }>, {}>>,
    Expect<Equal<PublicType<{ g: '_g' }>, { g: '_g' }>>,
    Expect<Equal<PublicType<{ __h: number; i: unknown }>, { i: unknown }>>,
]
