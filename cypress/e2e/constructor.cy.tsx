describe('проверка работы конструктора', () => {
  //вынес повторяющиеся селекторы в константы
  const SELECTORS = {
    constructorModule: `[data-cy='constructor-module']`,
    ingredientsModule: `[data-cy='ingredients-module']`,
    modal: `[data-cy='modal']`,
    modalOverlay: `[data-cy='modalOverlay']`,
    profileName: `[data-cy='profile-name']`,
  };

  beforeEach(() => {
    cy.fixture('ingredients.json');
    cy.fixture('feed.json');
    cy.fixture('user.json');
    cy.fixture('order.json');
    cy.intercept(
      { method: 'GET', url: 'api/ingredients' },
      { fixture: 'ingredients.json' }
    ).as('getIngredients');
    cy.intercept(
      { method: 'GET', url: 'api/auth/user' },
      { fixture: 'user.json' }
    ).as('user');
    cy.intercept(
      { method: 'GET', url: 'api/orders/all' },
      { fixture: 'feed.json' }
    ).as('feed');
    cy.intercept(
      { method: 'POST', url: 'api/orders' },
      { fixture: 'order.json' }
    ).as('order');
    cy.setCookie('accessToken', 'mockTokenForEvgeniya');
    localStorage.setItem('refreshToken', 'mockTokenForEvgeniya');
    cy.visit('/');
  });

  it('проверка работы cy.intercept', () => {
    cy.wait('@getIngredients');
    cy.wait('@user');
  });

  it('проверка наличия ингредиента в конструкторе - булки', () => {
    cy.get(SELECTORS.constructorModule).should(
      'not.contain.text',
      'просто какая-то булка'
    );
  });

  it('добавление ингредиента в конструктор - булки', () => {
    cy.get(SELECTORS.ingredientsModule)
      .first()
      .children()
      .last()
      .find('button')
      .click();
    cy.get(SELECTORS.constructorModule).should(
      'contain.text',
      'просто какая-то булка'
    );
  });

  it('добавление ингредиента в конструктор - другой ингредиент', () => {
    cy.get(SELECTORS.ingredientsModule)
      .next()
      .next()
      .children()
      .first()
      .find('button')
      .click();
    cy.get(SELECTORS.constructorModule).should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('тест открытия модального окна', () => {
    cy.contains('кратЕрная булка (от слова кратер)').click();
    cy.get(SELECTORS.modal).should('be.visible');
  });

  it('тест закрытия модального окна по крестику', () => {
    cy.contains('кратЕрная булка (от слова кратер)').click();
    cy.get(SELECTORS.modal).find('button').click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('тест закрытия модального окна по esc', () => {
    cy.contains('кратЕрная булка (от слова кратер)').click();
    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('тест закрытия модального окна по оверлею', () => {
    cy.contains('кратЕрная булка (от слова кратер)').click();
    cy.get(SELECTORS.modalOverlay).click('top', { force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('Проверка авторизации пользователя перед тестом', () => {
    cy.visit('/profile');
    cy.get(SELECTORS.profileName).should('have.value', '12345');
  });

  it('добавляем ингредиенты в заказ', () => {
    cy.get(SELECTORS.ingredientsModule)
      .first()
      .children()
      .last()
      .find('button')
      .click();

    cy.get(SELECTORS.ingredientsModule)
      .next()
      .next()
      .children()
      .first()
      .find('button')
      .click();

    cy.get(SELECTORS.ingredientsModule)
      .last()
      .children()
      .last()
      .find('button')
      .click();

    cy.get(SELECTORS.constructorModule)
      .children()
      .last()
      .find('button')
      .click();

    cy.wait('@order');

    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.modal).find('button').click();

    cy.get(SELECTORS.constructorModule)
      .children()
      .first()
      .should('contain.text', 'Выберите булки');

    cy.get(SELECTORS.constructorModule)
      .children()
      .first()
      .next()
      .should('contain.text', 'Выберите начинку');
  });
});
