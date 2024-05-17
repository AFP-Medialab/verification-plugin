/**
 * Example Unit Testing
 * Imports a .jsx file with example functions and test their outputs
 */
import {expect, test} from "@playwright/experimental-ct-react";
import {exampleHelloWorldFunction, exampleSumFunction} from "./exampleFunctions";

test('Example unit test: hello world', async ({ mount }) => {
  expect(exampleHelloWorldFunction()).toEqual("hello world");
});

test('Example unit test sum function', async ({mount}) => {
  expect(exampleSumFunction(2, 3)).toEqual(5);
});
