const selectors = {
  modal: '[data-testid="modal"]',
  overlay: '[data-testid="modal-overlay"]',
  constructor: '[data-testid="burger-constructor"]',
  modalCloseButton: '[data-testid="modal-close"]'
};

const testData = {
  bun: 'Краторная булка N-200i',
  bunTop: 'Краторная булка N-200i (верх)',
  bunBottom: 'Краторная булка N-200i (низ)',
  main: 'Биокотлета из марсианской Магнолии',
  addButton: 'Добавить'
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'mockAccessToken');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mockRefreshToken');
    });

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('Добавление булки в конструктор', () => {
      cy.contains('Выберите булки').should('exist');

      cy.contains('li', testData.bun)
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.get(selectors.constructor).contains(testData.bunTop).should('exist');
      cy.get(selectors.constructor).contains(testData.bunBottom).should('exist');
    });

    it('Добавление начинки в конструктор', () => {
      cy.contains('Выберите начинку').should('exist');

      cy.contains('li', testData.main)
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.get(selectors.constructor).contains(testData.main).should('exist');
    });

    it('Добавление соуса в конструктор', () => {
      cy.contains('li', 'Соус Spicy-X')
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.get(selectors.constructor).contains('Соус Spicy-X').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('Открытие модального окна при клике на ингредиент', () => {
      cy.contains('li', testData.bun).find('a').click();

      cy.get(selectors.modal).should('exist');
      cy.contains('Детали ингредиента').should('exist');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.contains('li', testData.bun).find('a').click();
      cy.get(selectors.modal).should('exist');

      cy.get(selectors.modalCloseButton).click();
      cy.get(selectors.modal).should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.contains('li', testData.main).find('a').click();
      cy.get(selectors.modal).should('exist');

      cy.get(selectors.overlay).click({ force: true });
      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
    });

    it('Создание заказа и отображение номера в модальном окне', () => {
      cy.contains('li', testData.bun)
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.contains('li', testData.main)
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.get(selectors.constructor).contains(testData.bunTop).should('exist');
      cy.get(selectors.constructor).contains(testData.main).should('exist');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(selectors.modal).should('exist');
      cy.get(selectors.modal).contains('61234').should('exist');

      cy.contains('идентификатор заказа').should('exist');
      cy.contains('Ваш заказ начали готовить').should('exist');
    });

    it('Закрытие модального окна заказа и очистка конструктора', () => {
      cy.contains('li', testData.bun)
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.contains('li', testData.main)
        .find('button')
        .contains(testData.addButton)
        .click();

      cy.get(selectors.constructor).contains(testData.bunTop).should('exist');
      cy.get(selectors.constructor).contains(testData.main).should('exist');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(selectors.modal).should('exist');
      cy.get(selectors.modal).contains('61234').should('exist');

      cy.get(selectors.modalCloseButton).click();

      cy.get(selectors.modal).should('not.exist');

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
