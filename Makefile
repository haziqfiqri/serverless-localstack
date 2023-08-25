up:
	docker-compose up -d

down:
	docker-compose down

deploy local:
	sls deploy --stage local --region us-east-1