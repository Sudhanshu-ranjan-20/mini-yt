FROM public.ecr.aws/lambda/nodejs:18

# Install curl
RUN yum install -y \
        curl \
        tar \
        xz \
    && yum clean all

# Download static ffmpeg
RUN curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
    | tar -xJ \
    && cp ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg \
    && chmod +x /usr/local/bin/ffmpeg

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json ./

RUN npm i --omit=dev

COPY dist .

RUN npm prune --omit=dev

CMD ["dist/index.handler"]