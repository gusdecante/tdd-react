import { render, screen } from "../../../core/test/setup";
import { UserList } from "./";
import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import en from "../../../core/locale/en.json";
import pt from "../../../core/locale/pt.json";

import { LanguageSelector } from "../index";
import { storage } from "../../../core/redux/storage";

const jsonRespUsers = [
  {
    id: 1,
    username: "user1",
    email: "user1@mail.com",
    image: null,
  },
  {
    id: 2,
    username: "user2",
    email: "user2@mail.com",
    image: null,
  },
  {
    id: 3,
    username: "user3",
    email: "user3@mail.com",
    image: null,
  },
  {
    id: 4,
    username: "user4",
    email: "user4@mail.com",
    image: null,
  },
  {
    id: 5,
    username: "user5",
    email: "user5@mail.com",
    image: null,
  },
  {
    id: 6,
    username: "user6",
    email: "user6@mail.com",
    image: null,
  },
  {
    id: 7,
    username: "user7",
    email: "user7@mail.com",
    image: null,
  },
];

const getPage = (page: number, size: number) => {
  let start = page * size;
  let end = start + size;
  const totalPages = Math.ceil(jsonRespUsers.length / size);

  return {
    content: jsonRespUsers.slice(start, end),
    page,
    size,
    totalPages,
  };
};

let header: string | null;
const server = setupServer(
  rest.get("/api/1.0/users", (req, res, ctx) => {
    header = req.headers.get("Authorization");
    let page = Number.parseInt(req.url.searchParams.get("page") as string);
    let size = Number.parseInt(req.url.searchParams.get("size") as string);

    if (Number.isNaN(page)) {
      page = 0;
    }

    if (Number.isNaN(size)) {
      size = 5;
    }

    return res(ctx.status(200), ctx.json(getPage(page, size)));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const user = userEvent.setup();

const setup = () => {
  render(<UserList />);
};

describe("User List", () => {
  describe("Interactions", () => {
    it("displays three users in list", async () => {
      setup();
      const users = await screen.findAllByText(/user/);
      expect(users.length).toBe(3);
    });
    it("displays next page link", async () => {
      setup();
      await screen.findByText("user1");
      expect(screen.getByText("next >")).toBeInTheDocument();
    });
    it("displays next page after clicking next", async () => {
      setup();
      await screen.findByText("user1");
      const nextPageLink = screen.getByText("next >");
      await user.click(nextPageLink);
      const firstUserOnPage2 = await screen.findByText("user4");
      expect(firstUserOnPage2).toBeInTheDocument();
    });
    it("hides next page link at last page", async () => {
      setup();
      await screen.findByText("user1");
      await user.click(screen.queryByText("next >") as HTMLElement);
      await screen.findByText("user4");
      await user.click(screen.queryByText("next >") as HTMLElement);
      await screen.findByText("user7");

      expect(
        screen.queryByText("next >") as HTMLElement
      ).not.toBeInTheDocument();
    });
    it("does not diplay previous page link in first page", async () => {
      setup();
      await screen.findByText("user1");
      const previousPageLink = screen.queryByText("< previous") as HTMLElement;
      expect(previousPageLink).not.toBeInTheDocument();
    });
    it("diplays previous page link in second page", async () => {
      setup();
      await screen.findByText("user1");
      await user.click(screen.queryByText("next >") as HTMLElement);
      await screen.findByText("user4");
      const previousPageLink = screen.queryByText("< previous") as HTMLElement;
      expect(previousPageLink).toBeInTheDocument();
    });
    it("diplays previous page after clicking previous page link", async () => {
      setup();
      await screen.findByText("user1");
      await user.click(screen.queryByText("next >") as HTMLElement);
      await screen.findByText("user4");
      await user.click(screen.queryByText("< previous") as HTMLElement);
      const firstUserOnFirtPage = await screen.findByText("user1");
      expect(firstUserOnFirtPage).toBeInTheDocument();
    });
    it("displays spinner during the api call is in progress", async () => {
      setup();
      const spinner = screen.getByRole("status");
      await screen.findByText("user1");
      expect(spinner).not.toBeInTheDocument();
    });
    it("sends request with authorization header", async () => {
      storage.setItem("auth", {
        id: 5,
        username: "user5",
        header: "auth header value",
        isLoggedIn: true,
      });
      setup();
      // redux behavior reasons
      await screen.findByText("user1");
      expect(header).toBe("auth header value");
    });
  });
  describe("Internationalization", () => {
    beforeEach(() => {
      server.use(
        rest.get("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getPage(1, 3)));
        })
      );
    });
    it("initialy displays header and navigation links in english", async () => {
      setup();
      await screen.findByText("user4");
      expect(screen.getByText(en.users)).toBeInTheDocument();
      expect(screen.getByText(en.nextPage)).toBeInTheDocument();
      expect(screen.getByText(en.previousPage)).toBeInTheDocument();
    });
    it("displays header and navigation links in portuguese after selection the language", async () => {
      setup();
      await screen.findByText("user4");
      await user.click(screen.getByTitle("Portuguese"));
      expect(screen.getByText(pt.users)).toBeInTheDocument();
      expect(screen.getByText(pt.nextPage)).toBeInTheDocument();
      expect(screen.getByText(pt.previousPage)).toBeInTheDocument();
    });
  });
});
