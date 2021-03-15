FROM python:3.7.3
ENV PYTHONUNBUFFERED 1
WORKDIR /site01
COPY requirements.txt /site01/
RUN pip install -r requirements.txt
COPY . /site01

CMD python manage.py runserver 0.0.0.0:$PORT