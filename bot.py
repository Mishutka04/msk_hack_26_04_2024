import asyncio
from aiogram import Bot, Dispatcher, types, F
import logging
from aiogram.filters import Command, CommandStart
from aiogram.enums import ParseMode
import pandas as pd
import matplotlib.pyplot as plt
from aiogram.types import FSInputFile
import os

import environ
from gradio_client import Client
from concurrent.futures import ThreadPoolExecutor

env = environ.Env()

TOKEN = env('TOKEN', default='')
GPT_URL = env('GPT_URL', default='')
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Создаем пул потоков
executor = ThreadPoolExecutor()


async def async_predict(input_message):
    client = Client(GPT_URL)
    loop = asyncio.get_event_loop()
    executor = None  # Подставьте здесь вашего выбора исполнителя

    result = await loop.run_in_executor(
        executor,
        lambda: client.predict(
            input_message,
            [["None", "None"]],
            "None",
            api_name="/model_chat")
    )
    return result[1][1][1]


@dp.message(Command("start"))
async def start_command(message: types.Message):
    await message.answer(
        text="\
Вас рад приветствовать <b>Gemini Patriot</b>\n\
Я очень мощный, в моей основе лежат\n\
<b> нейросети имеющие 72.3B параметров.</b>\n\
<b>Я прочитаю отзывы за вас и кратко изложу основные позитивные и негативные моменты относительно любого вебинара.</b>\n\
Справка: <b>/help</b>", parse_mode=ParseMode.HTML)


@dp.message(Command("help"))
@dp.message(CommandStart(
    deep_link=True, magic=F.args == "help"
))
async def cmd_start_help(message: types.Message):
    await message.answer(
        "Список доступных команд:\n\n\
<b>/webinars</b>\n\
<b>Вернёт список доступных вебинаров, для анализа</b>\n\n\
<b>Потом просто добавте название вебинара в строку чата и получите краткое содержание наиболее полезных данных из отзывов, мы отзывы прочитаем за вас </b>\n\n",
        parse_mode=ParseMode.HTML
        )


@dp.message(Command("webinars"))
async def webinars(message: types.Message):

    concatenated_questions_list = []


    # Замените 'data.csv' на путь к вашему файлу CSV
    df = pd.read_csv('train_data.csv')

    for index, row in df.iterrows():
        concatenated_questions = '/n'.join(row[['question_1']])
        concatenated_questions_list.append(concatenated_questions)
    concatenated_questions_list_grav = []
    for i in concatenated_questions_list:
        concatenated_questions_list_grav.append('`' + i + '`')
    concatenated_questions_str = "\n".join(set(concatenated_questions_list_grav))
    await message.answer(
            "Обрабатываем Ваш запрос, пожалуйста подождите.",
        )
    # answer = await async_predict(concatenated_questions_str)
    
    await message.answer(
        "<b>Вы можете получить обобщённую статистику отзывов не читая их. Ниже список доступных ВЕБИНАРОВ</b>",
        parse_mode=ParseMode.HTML
    )

    await message.answer(
        text=concatenated_questions_str,
        parse_mode="MarkdownV2"
        )


@dp.message(F.text)
async def any_message(message: types.Message):
    query = message.text.replace("/chat", "")
    await message.answer(
            "Ищем и читаем отзывы, пожалуйста подождите. Это может занять около 1 минуты.",
        )
    concatenated_questions_list = []

    # Замените 'data.csv' на путь к вашему файлу CSV
    df = pd.read_csv('train_data.csv')

    # Фильтруем DataFrame по текстовому запросу в столбце 'question_1'
    filtered_df = df[df['question_1'].str.contains(query, case=False)]

    for index, row in filtered_df.iterrows():
        concatenated_questions = ' '.join(row[['question_2', 'question_3', 'question_4', 'question_5']])
        concatenated_questions_list.append(concatenated_questions)

    await message.answer(
        f"Найдено {len(concatenated_questions_list)*4} отзывов.",
    )
    concatenated_questions_str = " ".join(concatenated_questions_list)
    print(concatenated_questions_str)

    if len(concatenated_questions_str)==0:
        await message.answer(
            "В базе отсутвуют отзывы на этот вебинар. Убедитесь в правильности запроса.",
        )
        return

    question=f"Выдели что нравится пользователям с указанием градации важности в процентах: {concatenated_questions_str}. Ответ в виде словаря python result_dict"
    answer = await async_predict(question)

    start_index = answer.find('{') + 1
    end_index = answer.find('}')
    values_inside_braces = answer[start_index:end_index].split('\n')

    result_dict = {}

    for i in values_inside_braces:
        l = i.split(":")
        if len(l)==2:
            result_dict[l[0].replace("    ", "")]=l[1]
        else:
            pass
    sorted_dict = dict(sorted(result_dict.items(), key=lambda item: item[1], reverse=True))
    print(list(sorted_dict.keys())[:10])
    result = "\n".join(list(sorted_dict.keys())[:10])
    plt.figure(figsize=(10, 8))
    plt.barh(list(sorted_dict.keys())[:10], list(sorted_dict.values())[:10], color='skyblue')
    plt.xlabel('Оценка важности отзывов в стеке')
    plt.ylabel('Основные моменты отзывов')
    plt.title('Распределение отзывов')
    current_directory = os.getcwd()
    file_path = os.path.join(current_directory, 'programming_scores.png')
    plt.savefig(file_path, bbox_inches='tight')
    
    await message.answer(
        text=result,
        parse_mode=ParseMode.HTML
        )
    photo = FSInputFile(file_path)
    await message.answer_photo(photo, has_spoiler=True)


async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
