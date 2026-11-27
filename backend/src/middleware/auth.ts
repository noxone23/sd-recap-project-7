import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../auth";

export const requireAuth: RequestHandler<Record<string, string>> = async (
  request,
  response,
  next,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }

  response.locals.userId = session.user.id;
  next();
};