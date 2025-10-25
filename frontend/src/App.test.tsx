import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  const title = getByText(/Image Uploading App/i);
  expect(title).toBeInTheDocument();
});
