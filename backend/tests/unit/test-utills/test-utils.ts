export const mockRequest = (body: any = {}, params: any = {}, query: any = {}): Request => ({
  body,
  params,
  query
} as any);

export const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};