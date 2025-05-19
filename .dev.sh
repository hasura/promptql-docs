#!/bin/bash

SESSION_NAME="pql-docs-dev"

tmux has-session -t $SESSION_NAME 2>/dev/null

if [ $? != 0 ]; then
  tmux new-session -s $SESSION_NAME -n 'development' -d
  
  CURRENT_DIR=$(pwd)
  
  tmux send-keys -t $SESSION_NAME:0.0 "cd $CURRENT_DIR && nvim ." C-m
  
  tmux split-window -t $SESSION_NAME:0.0 -v -l 40%
  tmux send-keys -t $SESSION_NAME:0.1 "cd $CURRENT_DIR && yarn start" C-m
  
  tmux split-window -t $SESSION_NAME:0.1 -h -l 50%
  tmux send-keys -t $SESSION_NAME:0.2 "cd $CURRENT_DIR" C-m

  tmux select-pane -t $SESSION_NAME:0.0
fi

tmux attach-session -t $SESSION_NAME

