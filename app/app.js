(function (){

    window.Application = function(){
        const app = this;
		app.name = '0001';
        app.version = '1.0';

		// Application parameters
        app.p = {
            ls : window.localStorage
        }

        // check if local storage data exists
        app.savedata = (app.p.ls.getItem(app.name) ? JSON.parse(app.p.ls.getItem(app.name)):{
            tasks : []
        })

        if(app.p.ls.getItem(app.name)){
            display_saved_tasks();
        }

        function display_saved_tasks(){
            for(let i = 0; i < app.savedata.tasks.length; i++){
                let done, saved_task;

                if(app.savedata.tasks[i].indexOf('[d]') == 0){
                    done = 'done';
                    saved_task = app.savedata.tasks[i].replace('[d]', '');
                } else {
                    done = '';
                    saved_task = app.savedata.tasks[i];
                }

                let todo_list = $('.todo .list');
                let list_item = $('<div class="list-item '+done+'"></div>');
                let check = $('<div class="check"><div class="circle"></div></div>');
                let task = $('<div class="task">'+saved_task+'</div>');
                let buttons = $('<div class="buttons"><div class="btn bin"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div>');

                list_item.append(check);
                list_item.append(task);
                list_item.append(buttons);

                todo_list.prepend(list_item);
            }
        }

        function add_task(){
            let todo_list = $('.todo .list');
            let list_item = $('<div class="list-item"></div>');
            let check = $('<div class="check"><div class="circle"></div></div>');
            let task = $('<div class="task"><input type="text" id="new_task_input" autofocus></div>');
            let buttons = $('<div class="buttons"><div class="btn tick" id="tick"><i class="fa fa-check" aria-hidden="true"></i></div><div class="btn bin"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div>');

            list_item.append(check);
            list_item.append(task);
            list_item.append(buttons);

            todo_list.prepend(list_item);

            // save task by tick button press
            $('.list').on('click', '.tick', function(){
                // get input text from new task item
                let task_input =  $('#new_task_input').val();

                if(task_input){
                    // remove input add text
                    $(this).closest('.list-item').children('.task').text(task_input);
                    // remove tick button
                    $(this).closest('.list-item').children('.buttons').html('<div class="btn bin"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div>');
                    // add to savadata object
                    app.savedata.tasks.push(task_input);
                    //save item
                    save_list();
                }

            });
            // save task by enter button press
			document.addEventListener('keypress', function(e){
				if(e.key == 'Enter'){
					let task_input =  $('#new_task_input').val();

					if(task_input){
                        $(':focus').closest('.list-item').children('.buttons').html('<div class="btn bin"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div>');
						$(':focus').closest('.list-item').children('.task').text(task_input);
                        app.savedata.tasks.push(task_input);
                        save_list();
                    }
				}

			});

        }

        function save_list(){
            app.p.ls.setItem(app.name, JSON.stringify(app.savedata));
        }

        // add task when plus button is clicked
        $('.add-task').on('click', function(){
            add_task();
        });

        // mark task as done with click on check button
        $('.list').on('click', '.check',function() {
            $(this).closest('.list-item').toggleClass('done');

            let task_text = $(this).closest('.list-item').children('.task').text();
            let saved_tasks = app.savedata.tasks;

            // // check if saved task has done attr '[d]'
            // if( saved_tasks[saved_tasks.indexOf(task_text)].indexOf('[d]') == -1 ){ // false
            //     saved_tasks[saved_tasks.indexOf(task_text)] = '[d]'+task_text;
            // }

            if($(this).closest('.list-item').hasClass('done')){ // true
                saved_tasks[saved_tasks.indexOf(task_text)] = '[d]'+task_text;
            } else { // false
                saved_tasks[saved_tasks.indexOf('[d]'+task_text)] = task_text;
            }

            save_list();
        });

        // remove task when bin button is clicked
        $('.list').on('click', '.bin',function(){
            if(confirm('Are sure you would like to delete this task?')){
                $(this).closest('.list-item').remove();
                let task_text = $(this).closest('.list-item').children('.task').text();
                let saved_tasks = app.savedata.tasks;

                if($(this).closest('.list-item').hasClass('done')){ // true
                    saved_tasks.splice(saved_tasks.indexOf('[d]'+task_text), 1);
                } else { // false
                    saved_tasks.splice(saved_tasks.indexOf(task_text), 1);
                }

                save_list();
            }
        });


		return app;
	}

})();
