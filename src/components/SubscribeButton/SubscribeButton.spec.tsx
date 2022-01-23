import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "jest-mock";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton component", () => {

  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated"
    });

    render(
      <SubscribeButton />
    );

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  })

  it("redirect user to signIn when not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated"
    });

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: "fake-expires",
        activeSubscription: "fake-active",
        user: {
          name: "John Doe",
          email: "john@doe.com",
        }
      },
      status: "authenticated"
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalledWith("/posts");
  });
});