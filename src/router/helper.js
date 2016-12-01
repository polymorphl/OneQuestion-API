// for protected route, validate auth key as middleware - Else, 401 in your face

const validateKey = async (ctx, next) => {
  const { authorization } = ctx.request.headers;
  if (authorization !== ctx.state.authorizationHeader) {
    return ctx.throw(401);
  }
  await next();
}

export default validateKey;
