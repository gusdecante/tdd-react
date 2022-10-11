import App from "./App";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { render, screen } from "./core/test/setup";
import { storage } from "./core/redux/storage";

let logoutCount = 0;
let header: string | null;
const server = setupServer(
  rest.post("/api/1.0/users/token/:token", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/api/1.0/users", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            username: "user-in-list",
            email: "user-in-list@mail.com",
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    header = req.headers.get("Authorization");
    const id = Number.parseInt(req.params.id as string);
    if (id === 1) {
      return res(
        ctx.json({
          id: 1,
          username: "user-in-list",
          email: "user-in-list@mail.com",
          image: null,
        })
      );
    }
    return res(
      ctx.json({
        id,
        username: `user${id}`,
        email: `user${id}@mail.com`,
        image: null,
      })
    );
  }),
  rest.post("/api/1.0/auth", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 5, username: "user5" }));
  }),
  rest.post("/api/1.0/logout", (req, res, ctx) => {
    logoutCount += 1;
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  logoutCount = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const user = userEvent.setup();

const setup = (path: string) => {
  window.history.pushState({}, "", path);
  render(<App />);
};

describe("Routing", () => {
  it.each`
    path               | pageTestId
    ${"/"}             | ${"home-page"}
    ${"/signup"}       | ${"signup-page"}
    ${"/login"}        | ${"login-page"}
    ${"/user/1"}       | ${"user-page"}
    ${"/user/2"}       | ${"user-page"}
    ${"/activate/123"} | ${"activation-page"}
    ${"/activate/456"} | ${"activation-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${"/"}             | ${"signup-page"}
    ${"/"}             | ${"login-page"}
    ${"/"}             | ${"user-page"}
    ${"/"}             | ${"activation-page"}
    ${"/signup"}       | ${"home-page"}
    ${"/signup"}       | ${"login-page"}
    ${"/signup"}       | ${"user-page"}
    ${"/signup"}       | ${"activation-page"}
    ${"/login"}        | ${"home-page"}
    ${"/login"}        | ${"signup-page"}
    ${"/login"}        | ${"user-page"}
    ${"/login"}        | ${"activation-page"}
    ${"/user/1"}       | ${"home-page"}
    ${"/user/1"}       | ${"singup-page"}
    ${"/user/1"}       | ${"login-page"}
    ${"/user/1"}       | ${"activation-page"}
    ${"/activate/123"} | ${"home-page"}
    ${"/activate/123"} | ${"signup-page"}
    ${"/activate/123"} | ${"login-page"}
    ${"/activate/123"} | ${"user-page"}
  `(
    "does not displays $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);
      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
  `("has link to $targetPage on NavBar", ({ targetPage }) => {
    setup("/");
    const link = screen.getByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickInto    | visiblePage
    ${"/"}       | ${"Sign Up"} | ${"signup-page"}
    ${"/signup"} | ${"Home"}    | ${"home-page"}
    ${"/signup"} | ${"Login"}   | ${"login-page"}
  `(
    "displays $visiblePage after clicking $clickingTo",
    async ({ initialPath, clickInto, visiblePage }) => {
      setup(initialPath);
      const link = screen.getByRole("link", { name: clickInto });
      await user.click(link);
      expect(screen.getByTestId(visiblePage)).toBeInTheDocument();
    }
  );

  it("displays home page when clicking brand logo", async () => {
    setup("/login");
    const logo = screen.queryByAltText("Hoaxify") as HTMLImageElement;
    await user.click(logo);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("navigates to user page when clicking the username on list", async () => {
    setup("/");

    const nickname = await screen.findByText("user-in-list");
    await user.click(nickname);
    const page = await screen.findByTestId("user-page");
    expect(page).toBeInTheDocument();
  });
});

describe("Login", () => {
  const setupLoggedIn = async () => {
    setup("/login");
    await user.type(screen.getByLabelText("E-mail"), "user5@mail.com");
    await user.type(screen.getByLabelText("Password"), "P4ssword");
    await user.click(screen.getByRole("button", { name: "Login" }));
  };
  it("displays My Profile link on navbar after successful login", async () => {
    setup("/login");
    const myProfileBeforeLogin = screen.queryByRole("link", {
      name: "My Profile",
    });
    expect(myProfileBeforeLogin).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("E-mail"), "user5@mail.com");
    await user.type(screen.getByLabelText("Password"), "P4ssword");
    await user.click(screen.getByRole("button", { name: "Login" }));
    await screen.findByTestId("home-page");
    const myProfileAfterLogin = screen.queryByRole("link", {
      name: "My Profile",
    });
    expect(myProfileAfterLogin).toBeInTheDocument();
  });
  it("redirects to homepage after successful login", async () => {
    await setupLoggedIn();
    const page = await screen.findByTestId("home-page");
    expect(page).toBeInTheDocument();
  });

  it("hides Login and Sign Up from navbar after successful login", async () => {
    await setupLoggedIn();
    await screen.findByTestId("home-page");
    const loginLink = screen.queryByRole("link", { name: "Login" });
    const signUpLink = screen.queryByRole("link", { name: "Sign Up" });
    expect(loginLink).not.toBeInTheDocument();
    expect(signUpLink).not.toBeInTheDocument();
  });
  it("displays user page with logged in user id in url after clicking My Profile link", async () => {
    await setupLoggedIn();
    await screen.findByTestId("home-page");
    const myProfileLink = screen.queryByRole("link", {
      name: "My Profile",
    }) as HTMLElement;
    await user.click(myProfileLink);
    await screen.findByTestId("user-page");
    const username = await screen.findByText("user5");
    expect(username).toBeInTheDocument();
  });
  it("stores logged in state in local storage", async () => {
    setupLoggedIn();
    await screen.findByTestId("home-page");
    const state = storage.getItem("auth");
    expect(state.isLoggedIn).toBeTruthy();
  });
  it("displays layout of logged in state", () => {
    storage.setItem("auth", { isLoggedIn: true });
    setup("/");
    const myProfileLink = screen.queryByRole("link", {
      name: "My Profile",
    });
    expect(myProfileLink).toBeInTheDocument();
  });
  it("refreshes user page from another user to the logged in user after clicking My Profile", async () => {
    storage.setItem("auth", { id: 5, username: "user5", isLoggedIn: true });
    setup("/");
    const userItem = await screen.findByText("user-in-list");
    await user.click(userItem);
    await screen.findByRole("heading", { name: "user-in-list" });
    const myProfileLink = screen.getByRole("link", {
      name: "My Profile",
    });
    await user.click(myProfileLink);
    const user5 = await screen.findByRole("heading", { name: "user5" });
    expect(user5).toBeInTheDocument();
  });
});

describe("Logout", () => {
  let logoutLink: HTMLElement;
  const setupLoggedIn = () => {
    storage.setItem("auth", {
      id: 5,
      username: "user5",
      isLoggedIn: true,
      header: "auth header value",
    });
    setup("/");
    logoutLink = screen.getByRole("link", {
      name: "Logout",
    });
  };
  it("displays Logou link on navbar after successful login", () => {
    setupLoggedIn();
    expect(logoutLink).toBeInTheDocument();
  });
  it("displays login and sign up on navbar after clicking logout", async () => {
    setupLoggedIn();
    await user.click(logoutLink);
    const loginLink = await screen.findByRole("link", { name: "Login" });
    expect(loginLink).toBeInTheDocument();
  });
  it("sends logout request to backend after clicking logout", async () => {
    setupLoggedIn();
    await user.click(logoutLink);
    await screen.findByRole("link", { name: "Login" });
    expect(logoutCount).toBe(1);
  });
  it("removes authorization header from requests after user logs out", async () => {
    setupLoggedIn();
    await user.click(logoutLink);
    await user.click(screen.getByText("user-in-list"));
    await screen.findByRole("heading", { name: "user-in-list" });
    expect(header).toBeFalsy();
  });
});

console.error = () => {};
