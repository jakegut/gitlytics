import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import CoursesList from './CoursesList'
import CreateCourse from './CreateCourse';
import ViewCourse from './ViewCourse';
import CreateProject from '../Projects/CreateProject';
import ViewRepos from '../Projects/ViewRepos';

export default function Courses(){

    let { path, url } = useRouteMatch();

    return(
        <div>
            <Switch>
                <Route exact path={path} component={CoursesList}/>
                <Route path={`${path}/create`} component={CreateCourse} />
                <Route exact path={`${path}/:course_id`} component={ViewCourse} />
                <Route path={`${path}/:course_id/p/create`} component={CreateProject} />
                <Route exact path={`${path}/:course_id/project/:project_id/repos`} component={ViewRepos} />
            </Switch>
        </div>
    )
}