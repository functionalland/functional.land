import {
  always,
  applySpec,
  cond,
  converge,
  curry,
  map,
  path,
  prop,
  pipe,
  test
} from "https://deno.land/x/ramda@v0.27.2/mod.ts";

import Task from "../functional/library/Task.js";
import { assertIsInstance, encodeText } from "https://deno.land/x/functional@v1.3.3/library/utilities.js";
import startHTTPServer from "../functional-http-server/library/server.js";
import File from "https://deno.land/x/functional_io@v1.1.0/library/File.js";
import Response from "https://deno.land/x/functional_io@v1.1.0/library/Response.js";
import { readFile } from "https://deno.land/x/functional_io@v1.1.0/library/fs.js";

const factorizeResponse = curry(Response.Success);
const resolveMimeType = cond([
  [
    test(/\.js$/),
    always("text/javascript")
  ],
  [
    test(/\.css$/),
    always("text/css")
  ],
  [
    test(/\.html$/),
    always("text/html")
  ],
  [
    always(true),
    always("text/plain")
  ]
]);

const catchMap = curry((unaryFunction, task) => Task.prototype.catch.call(task, unaryFunction));

startHTTPServer(
  { port: Number(Deno.env.get("PORT")) || 8080 },
  pipe(
    path([ "headers", "url" ]),
    path => File.fromPath(`${Deno.cwd()}/${path === "/" ? "index.html" : path.replace("?fragment=true", "")}`),
    readFile,
    map(
      converge(
        factorizeResponse,
        [
          pipe(
            prop("path"),
            applySpec({
              headers: {
                "Access-Control-Allow-Origin": always("*"),
                "Cache-Control": always("max-age=31536000"),
                "Content-Type": resolveMimeType
              },
              status: always(200)
            }),
          ),
          prop("raw")
        ]
      )
    ),
    catchMap(error =>
      assertIsInstance(Deno.errors.NotFound, error)
        ? Response.NotFound({}, new Uint8Array([]))
        : Response.InternalServerError({}, encodeText(error.message))
    )
  )
);