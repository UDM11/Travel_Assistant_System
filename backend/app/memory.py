from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings


embeddings = OpenAIEmbeddings()
vectordb = Chroma(persist_directory=".chroma", embedding_function=embeddings)