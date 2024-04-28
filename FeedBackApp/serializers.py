from asgiref.sync import sync_to_async
import requests
from rest_framework import serializers

from .models import Event, Question, Answer, EventDescription

API_TOKEN = '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'
API_URL = "https://api-inference.huggingface.co/models/Dpanov2302/sbert-reviews-classification"
headers = {"Authorization": f"Bearer {API_TOKEN}"}
from gradio_client import Client

client = Client("https://qwen-qwen1-5-72b-chat.hf.space/--replicas/3kh1x/")


def class_object(text):
    dox = f"кому направлен отзыв. выбери один варинат наиболее веротяный \
        0 - техническая часть вебинара (Примеры: интерактивный подход к изучению, структура материала, практических задач, просто и понятно, хорошая структура, доступном виде, правильной формулировки вопросов) , \
        1 - программа вебинара (Примеры: тема с подробными примерами, практических задач, подробности реализации, детальный разбор, был очень подробным и полезным, ясное и чёткое, совместилось обучение, примеры на кейсах из жизни, информативной и понятной), \
        2 - преподаватель (Примеры:лектор, лектор имел, материал более живым, обсуждение актуальных тем тендеций, обсуждение применения, освещение, презентация, дискуссия о, лекция о, доклад о, харизма преподователя, преподаватель, он рассказывает, зазнался, умный).\
        {text.replace('.', '').lower()}"
    result = client.predict(
        dox,  # str  in 'Input' Textbox component
        [["None", "None"], ],
        # Tuple[str | Dict(file: filepath, alt_text: str | None) | None, str | Dict(file: filepath, alt_text: str | None) | None]  in 'Qwen1.5-72B-Chat' Chatbot component
        "None",  # str  in 'parameter_9' Textbox component
        api_name="/model_chat"
    )

    answer = result[1][1][1].lower()

    if "техническую часть" in answer or "технической части" in answer or "техническая часть" in answer or "организация вебинара" in answer or "tech" in answer or "нет определенного варианта" in answer:
        return 0
    elif "преподаватель" in answer or "лектор" in answer or "1 - программе вебинара" in answer or "prepodavatel" in answer:
        return 1
    else:
        return 2


def bool_inform(text):
    dox = f"Информативно или не информативно?: {text}"
    result = client.predict(
        dox,  # str  in 'Input' Textbox component
        [["None", "None"], ],
        # Tuple[str | Dict(file: filepath, alt_text: str | None) | None, str | Dict(file: filepath, alt_text: str | None) | None]  in 'Qwen1.5-72B-Chat' Chatbot component
        "None",  # str  in 'parameter_9' Textbox component
        api_name="/model_chat"
    )

    answer = result[1][1][1].lower()
    if "не информативно" in answer or "не информативным" in answer or "не информативное" in answer or "не является информативным" in answer:
        return False
    return True


def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


class EventSerializers(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def create(self, validated_data):
        return Event.objects.create(**validated_data)


class EventDescriptionSerializers(serializers.ModelSerializer):
    class Meta:
        model = EventDescription
        fields = '__all__'

    def create(self, validated_data):
        return EventDescription.objects.create(**validated_data)


class QuestionSerializers(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

    def get_queryset(self):
        event = self.kwargs.get(self.id)
        questions = Question.objects.filter(event=event)
        return questions

    def create(self, validated_data):
        return Question.objects.create(**validated_data)


class AnswerUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class AnswerSerializers(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

    def create(self, validated_data):
        # validated_data['informative'] = bool_inform(validated_data['informative'])
        # try:
        #     posit = query(validated_data['answer'])
        #     if posit[0][0]['score'] > posit[0][1]['score']:
        #         if posit[0][0]['label'] == 'positive':
        #             validated_data['positive'] = True
        # except:
        #     pass
        # validated_data['objects_class'] = int(class_object(str(validated_data['objects_class'])))

        return Answer.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.answer = validated_data.get("answer", instance.answer)
        instance.informative = validated_data.get("informative", instance.informative)
        instance.positive = validated_data.get("positive", instance.positive)
        instance.question = validated_data.get("question", instance.question)
        instance.user = validated_data.get("user", instance.user)
        instance.objects_class = validated_data.get("objects_class", instance.objects_class)
        instance.save()
        return instance


class AnswerUpdateSerializers(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'