import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("App renders without issue", () => {
  expect(() => render(<App />)).not.toThrow();
});
