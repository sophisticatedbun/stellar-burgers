
const selectors = {
  modal: '[class*="modal"]',
  overlay: '[class*="overlay"]',
  constructor: '[class*="burger_constructor"]',
  modalCloseButton: '[class*="modal"] button'
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
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

      cy.contains('li', 'Краторная булка N-200i')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(selectors.constructor)
        .contains('Краторная булка N-200i (верх)')
        .should('exist');
      cy.get(selectors.constructor)
        .contains('Краторная булка N-200i (низ)')
        .should('exist');
    });

    it('Добавление начинки в конструктор', () => {
      cy.contains('Выберите начинку').should('exist');

      cy.contains('li', 'Биокотлета из марсианской Магнолии')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(selectors.constructor)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });

    it('Добавление соуса в конструктор', () => {
      cy.contains('li', 'Соус Spicy-X')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(selectors.constructor).contains('Соус Spicy-X').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('Открытие модального окна при клике на ингредиент', () => {
      cy.contains('li', 'Краторная булка N-200i').find('a').click();

      cy.get(selectors.modal).should('exist');
      cy.contains('Детали ингредиента').should('exist');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.contains('li', 'Краторная булка N-200i').find('a').click();
      cy.get(selectors.modal).should('exist');

      cy.get(selectors.modalCloseButton).click();
      cy.get(selectors.modal).should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.contains('li', 'Биокотлета из марсианской Магнолии').find('a').click();
      cy.get(selectors.modal).should('exist');

      cy.get(selectors.overlay).click({ force: true });
      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', 'api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
    });

    it('Создание заказа и отображение номера в модальном окне', () => {
      cy.contains('li', 'Краторная булка N-200i')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('li', 'Биокотлета из марсианской Магнолии')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(selectors.constructor)
        .contains('Краторная булка N-200i (верх)')
        .should('exist');
      cy.get(selectors.constructor)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(selectors.modal).should('exist');
      cy.get(selectors.modal).contains('61234').should('exist');

      cy.contains('идентификатор заказа').should('exist');
      cy.contains('Ваш заказ начали готовить').should('exist');
    });

    it('Закрытие модального окна заказа и очистка конструктора', () => {
      cy.contains('li', 'Краторная булка N-200i')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('li', 'Биокотлета из марсианской Магнолии')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(selectors.constructor)
        .contains('Краторная булка N-200i (верх)')
        .should('exist');
      cy.get(selectors.constructor)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');

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
