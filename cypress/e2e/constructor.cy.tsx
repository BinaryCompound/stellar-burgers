describe('проверка работы конструктора', () => {
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
    //находим div с конструктором, проверяем, что в нем нет флуоресцентной булки
    cy.get(`[data-cy='constructor-module']`).should(
      'not.contain.text',
      'просто какая-то булка'
    );
  });

  it('добавление ингредиента в конструктор - булки', () => {
    //находим div с ингредиентами, доходим до кнопки "добавить" в ингредиенте флуоресцентной булки, нажимаем
    cy.get(`[data-cy='ingredients-module']`)
      .first()
      .children()
      .last()
      .find('button')
      .click();
    //проверяем, что в конструкторе появилась флуоресцентная булка
    cy.get(`[data-cy='constructor-module']`).should(
      'contain.text',
      'просто какая-то булка'
    );
  });

  it('добавление ингредиента в конструктор - другой ингредиент', () => {
    //находим div с ингредиентами, доходим до кнопки "добавить" в ингредиенте с биокотлетой, нажимаем
    cy.get(`[data-cy='ingredients-module']`)
      .next()
      .next()
      .children()
      .first()
      .find('button')
      .click();
    //проверяем, что в конструкторе появилась биокотлета
    cy.get(`[data-cy='constructor-module']`).should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('тест открытия модального окна', () => {
    //находим ссылку с кратерной булкой, нажимаем
    cy.contains('кратЕрная булка (от слова кратер)').click();
    //находим модальное окно, проверяем, что модальное окно видимо
    cy.get(`[data-cy='modal']`).should('be.visible');
  });

  it('тест закрытия модального окна по крестику', () => {
    cy.contains('кратЕрная булка (от слова кратер)').click();
    //находим кнопку в модалке, нажимаем
    cy.get(`[data-cy='modal']`).find('button').click();
    //проверяем, что модальное окно закрыто
    cy.get(`[data-cy='modal']`).should('not.exist');
  });

  it('тест закрытия модального окна по esc', () => {
    //находим ссылку с кратерной булкой, нажимаем
    cy.contains('кратЕрная булка (от слова кратер)').click();
    //нажимаем на кнопку эскейп
    cy.get('body').type('{esc}');
    //проверяем, что модальное окно закрыто
    cy.get(`[data-cy='modal']`).should('not.exist');
  });

  it('тест закрытия модального окна по оверлею', () => {
    //находим ссылку с кратерной булкой, нажимаем
    cy.contains('кратЕрная булка (от слова кратер)').click();
    //нажимаем на поле вверху экрана (выше модалки)
    cy.get(`[data-cy='modalOverlay']`).click('top', { force: true });
    //проверяем, что модальное окно закрыто
    cy.get(`[data-cy='modal']`).should('not.exist');
  });

  // перехватываем апи размещения заказа и проверяем авторизацию
  // beforeEach(() => {
  //   cy.intercept({method: 'POST', url: 'api/orders'}, { fixture: 'order.json' }).as('order');
  //   cy.wait()
  // });
  //проверяем, что имя пользователя в профиле совпадает с fixture
  it('Проверка авторизации пользователя перед тестом', () => {
    cy.visit('/profile');
    cy.get(`[data-cy='profile-name']`).should('have.value', '12345');
  });

  // добавляем в заказ флуоресцентную булку
  it('добавляем ингредиенты в заказ', () => {
    // добавляем в заказ флуоресцентную булку
    cy.get(`[data-cy='ingredients-module']`)
      .first()
      .children()
      .last()
      .find('button')
      .click();

    // добавляем в заказ биокотлету
    cy.get(`[data-cy='ingredients-module']`)
      .next()
      .next()
      .children()
      .first()
      .find('button')
      .click();

    // добавляем в заказ соус антарианского плоскоходца
    cy.get(`[data-cy='ingredients-module']`)
      .last()
      .children()
      .last()
      .find('button')
      .click();

    //нажимаем на кнопку заказа
    cy.get(`[data-cy='constructor-module']`)
      .children()
      .last()
      .find('button')
      .click();

    cy.wait('@order');

    //проверяем, что модальное окно открылось
    cy.get(`[data-cy='modal']`).should('be.visible');

    //нажимаем на кнопку закрытия
    cy.get(`[data-cy='modal']`).find('button').click();

    //проверяем, что конструктор пустой -
    cy.get(`[data-cy='constructor-module']`)
      .children()
      .first()
      .should('contain.text', 'Выберите булки');

    cy.get(`[data-cy='constructor-module']`)
      .children()
      .first()
      .next()
      .should('contain.text', 'Выберите начинку');
  });
});
