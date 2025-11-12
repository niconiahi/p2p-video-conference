import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { Form } from "react-router";
import * as v from "valibot";

const usernameSchema = v.pipe(v.string(), v.minLength(1));

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "username": {
      const result = v.safeParse(usernameSchema, formData.get("username"));
      if (!result.success) {
        throw data({ error: result.issues.toString() }, { status: 404 });
      }
      const redirect_to = new URLSearchParams(
        new URL(request.url).searchParams,
      ).get("redirectTo");
      if (!redirect_to) {
        throw new Error("redirectTo search param is required");
      }
      const url = new URL(redirect_to);
      const username = result.output;
      url.searchParams.set("username", username);
      const host = url.searchParams.get("host");
      if (!host) {
        url.searchParams.set("host", username);
      }
      return redirect(url.toString());
    }

    default: {
      throw new Error("Unknown action");
    }
  }
}

export default () => {
  return (
    <main className="max-w-3xl mx-auto space-y-2 flex items-center justify-center h-screen">
      <Form
        className="bg-red-200 border-2 border-red-900 flex flex-col gap-2 p-1"
        method="POST"
      >
        <p className="flex flex-col space-y-1">
          <label htmlFor="caller" className="text-red-900">
            Username
          </label>
          <input
            required
            type="text"
            name="username"
            id="username"
            className="border-2 border-red-900"
          />
        </p>
        <button
          className="p-4 w-full bg-red-200 border-2 border-red-900 text-red-900 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-100 disabled:text-red-300 disabled:border-red-300"
          type="submit"
          name="_action"
          value="username"
        >
          Use this username
        </button>
      </Form>
    </main>
  );
};
