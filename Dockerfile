FROM docker.io/gradle:jdk21
COPY . /code/app/
RUN \
    cd /code/app/ && \
    rm -Rf build node_modules && \
    gradle assemble -x test && \
    mv /code/app/build/libs/*.jar /code/ && \
    rm -Rf /code/app/ /root/.gradle /root/.cache /tmp/* /var/tmp/*

# Sleep bo back się inicjuje szybciej od baz no i od keycloaka
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS
CMD sleep 20 && java -Djava.security.egd=file:/dev/./urandom -jar /code/*.jar
EXPOSE 8000