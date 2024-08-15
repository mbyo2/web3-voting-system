export const handleError = (error) => {
    console.error('An error occurred:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again later.';
  };