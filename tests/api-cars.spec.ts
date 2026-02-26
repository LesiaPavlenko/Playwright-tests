import { test, expect, request, APIRequestContext } from '@playwright/test';

function getRandomMileage() {
  return Math.floor(Math.random() * 100000);
}

test.describe('Cars API', () => {
  let apiContext: APIRequestContext;
  let createdCarId: number | null = null;

  test.beforeEach(async () => { 
    apiContext = await request.newContext({
      baseURL: 'https://qauto.forstudy.space',
      storageState: 'storageState.json',
    });
  });

  test.afterEach(async () => { // Clean up created car after each test
    if (createdCarId) {
      await apiContext.delete(`/api/cars/${createdCarId}`);
      createdCarId = null;
    }
  });

  test('Positive: create car', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: getRandomMileage(),
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    createdCarId = body.data.id;
  });

  test('Negative: create car without mileage', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('Negative: invalid brand', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 9999,
        carModelId: 1,
        mileage: getRandomMileage(),
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Negative: invalid model', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 9999,
        mileage: getRandomMileage(),
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Negative: negative mileage', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: -100,
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Negative: mileage as string', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: "text",
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Positive: create car with large mileage', async () => {
    const response = await apiContext.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 999999,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    createdCarId = body.data.id;
  });

});