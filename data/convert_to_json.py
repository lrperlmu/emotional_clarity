
import csv
import json


if __name__ == '__main__':
    
    with open('knowledgebase.csv') as knowledgebase:
        reader = csv.DictReader(knowledgebase)
        
        content = []
        for line in reader:
            content.append(line)
        
        print content

        with open('knowledgebase.json', 'w') as output:
            json.dump(content, output)
        

    

