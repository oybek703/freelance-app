export

start: build_notifications
	docker-compose up -d

stop:
	docker-compose stop

clean:
	docker-compose down

rebuild:
	docker-compose up --build

build_notifications:
	 bash build-service.sh notifications

