FROM python:3.7.3
LABEL maintainer zenuie
ENV PYTHONUNBUFFERED 1
RUN mkdir /site01
WORKDIR /site01
COPY . /site01
RUN pip install -r requirements.txt
