import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

const post = { 
  slug: "my-new-post", 
  title: "My New Post", 
  content: "<p>Post excerpt</p>", 
  updatedAt: "23 de Janeiro"
};

describe("Post page", () => {
  it("renders correctly", () => {
    render(
      <Post post={post} />
    );

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);
    
    const response = await getServerSideProps({ params: { slug: "my-new-post" } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        })
      })
    );
  });    

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription"
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: "heading", text: "My new post"}
          ],
          content: [
            { type: "paragraph", text: "Post Content" }
          ],
        },
        last_publication_date: "01-23-2022"
      })
    } as any);

    
    const response = await getServerSideProps({ params: { slug: "my-new-post" } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post Content</p>",
            updatedAt: "23 de janeiro de 2022"
          }
        }
      })
    );
  });
});