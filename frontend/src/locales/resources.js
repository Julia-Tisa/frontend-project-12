// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ru: {
      translation: {
        buttons: {
          exit: 'Выход',
          entrance: 'Войти',
          registration: 'Зарегистрироваться',
          record: 'Регистрация',
        },
        validation: {
          nameLengthMin: 'В имени должно быть не менее 3 символов',
          nameLengthMax: 'В имени должно быть не более 20 символов',
          passwordLengthMin: 'Пароль не может содержать меньше 5 символов',
          required: 'Обязательное поле',
          passwordConfirmation: 'Пароли не совпадают',
          channelNameMin: 'В названии должно быть не менее 3 символов',
          channelNameMax: 'В названии должно быть не более 20 символов',
          channelExists: 'Название должно быть уникальным',
        },
        form: {
          username: 'Ваш ник',
          password: 'Пароль',
          passwordConfirmation: 'Подтвердите пароль',
          errorLogin: 'Неверные имя пользователя или пароль',
        },
        headers: {
          entrance: 'Войти',
          registration: 'Регистрация',
          logo: 'Hexlet Chat',
        },
        channels: {
          channels: 'Каналы',
          remove: 'Удалить',
          rename: 'Переименовать',
          add: 'Добавить канал',
          name: 'Имя канала',
          cancel: 'Отменить',
          submit: 'Отправить',
          renameChannel: 'Переименовать канал',
          removeChannel: 'Удалить канал',
          confirmation: 'Уверены?',
        },
        messages: {
          enter: 'Введите новое сообщение...',
          messagesCount_one: '{{count}} сообщение',
          messagesCount_few: '{{count}} сообщения',
          messagesCount_many: '{{count}} сообщений',
        },
        toast: {
          add: 'Канал создан',
          remove: 'Канал удалён',
          rename: 'Канал переименован',
          error: 'Ошибка загрузки данных',

        },
        page404: 'Ошибка 404. Страница не найдена.',
        pageForm: 'на главную страницу',
        isReg: 'Нет аккаунта?',
        isLogin: 'Уже есть аккаунт?',
        loading: 'Загрузка...',
        redirect: 'Вы можете перейти',
        exists: 'Такой пользователь уже существует',
      },
    },
  };