// app/api/user/[id].ts

import type { NextFetchEvent, NextRequest } from "next/server";
import { createEdgeRouter } from "next-connect";
import { NextResponse } from "next/server";
import cors from "cors";

interface RequestContext {
  params: {
    id: string;
  };
}

// Пример функции для получения пользователя (замените на вашу реальную реализацию)
const getUser = (id: string) => {
  return { id, name: "John Doe" }; // Пример данных пользователя
};

// Пример функции для обновления пользователя (замените на вашу реальную реализацию)
const updateUser = async (user: any) => {
  return { ...user, updated: true }; // Пример обновленного пользователя
};

// Пример ошибки для запрета доступа
class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  // Пример middleware
  .use(async (req, event, next) => {
    const start = Date.now();
    await next(); // вызов следующей функции в цепочке
    const end = Date.now();
    console.log(`Request took ${end - start}ms`);
  })
  .get((req) => {
    const id = req.context.params.id;
    const user = getUser(id);
    return NextResponse.json({ user });
  })
  .put(async (req) => {
    const id = req.context.params.id;
    // Здесь предполагается, что у вас есть логика для получения текущего пользователя
    const currentUser = { id: "1" }; // Пример текущего пользователя

    if (currentUser.id !== id) {
      throw new ForbiddenError("You can't update other user's profile");
    }

    const body = await req.json();
    const user = await updateUser(body.user);
    return NextResponse.json({ user });
  });

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function PUT(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
