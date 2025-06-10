export const handeSaveError = (error, doc, next) => {
  const { name, code } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  console.log(error);
  next(error);
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
