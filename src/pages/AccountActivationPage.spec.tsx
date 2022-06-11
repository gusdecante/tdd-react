import { render, screen } from "@testing-library/react";
import AccountActivationPage from "./AccountActivationPage";
import { setupServer } from "msw/node";
import { rest } from "msw";
import Router from "react-router-dom";

let counter = 0;
const server = setupServer(
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    if (req.params.token === "5678") {
      return res(ctx.status(400));
    }
    counter += 1;
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("Account Activation Page", () => {
  const setup = (token: string) => {
    jest.spyOn(Router, "useParams").mockReturnValue({ token });
    render(<AccountActivationPage />);
  };

  it("displays activation success message when token is valid", async () => {
    setup("1234");
    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("sends activation request to backend", async () => {
    setup("1234");
    await screen.findByText("Account is activated");
    expect(counter).toBe(1);
  });
  it("displays activation failure when token is invalid", async () => {
    setup("5678");
    const message = await screen.findByText("Activation failure");
    expect(message).toBeInTheDocument();
  });
});
